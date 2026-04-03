import type { $Fetch } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import type { NuxtApp } from '#app'
import type { PublicModuleOptions } from './types/options'
import type { TokenStorage } from './types/config'
import { IDENTITY_LOADED_KEY } from './utils/constants'
import { createHttpClient } from './httpFactory'
import { defineNuxtPlugin, useState } from '#app'
import { useSanctumAppConfig } from './composables/useSanctumAppConfig'
import { useSanctumConfig } from './composables/useSanctumConfig'
import { useSanctumLogger } from './utils/logging'
import { useSanctumTokenStorage } from './composables/useSanctumTokenStorage'
import { useSanctumUser } from './composables/useSanctumUser'

async function resolveTokenStorage(nuxtApp: NuxtApp, logger: ConsolaInstance): Promise<TokenStorage> {
  let appConfig = useSanctumAppConfig()

  if (appConfig.tokenStorage) {
    return appConfig.tokenStorage
  }

  await nuxtApp.callHook('sanctum:storage:token')

  appConfig = await nuxtApp.runWithContext(() => useSanctumAppConfig())

  if (appConfig.tokenStorage) {
    return appConfig.tokenStorage
  }

  logger.debug('Token storage is not defined, switch to default cookie storage')

  const defaultStorage = await import('./storages/cookieTokenStorage')
  return defaultStorage.cookieTokenStorage
}

async function initialIdentityLoad(nuxtApp: NuxtApp, client: $Fetch, options: PublicModuleOptions, logger: ConsolaInstance) {
  const identityFetchedOnInit = useState<boolean>(
    IDENTITY_LOADED_KEY,
    () => false,
  )

  if (identityFetchedOnInit.value) {
    return
  }

  const user = useSanctumUser()

  if (user.value !== null) {
    return
  }

  identityFetchedOnInit.value = true
  logger.debug('Fetching user identity on plugin initialization')

  if (!options.endpoints.user) {
    throw new Error('`sanctum.endpoints.user` is not defined')
  }

  try {
    const response = await client.raw(
      options.endpoints.user,
      { ignoreResponseError: true },
    )

    if (response.ok) {
      user.value = response._data
      return await nuxtApp.callHook('sanctum:init')
    }

    if ([401, 419].includes(response.status)) {
      logger.debug(
        'User is not authenticated on plugin initialization, status:',
        response.status,
      )
    }
    else {
      logger.error(
        'Unable to load user identity from API',
        { status: response.status },
      )
    }
  }
  catch (err) {
    logger.error(
      'An unexpected error occurred while fetching user identity',
      { reason: err },
    )
  }
}

export default defineNuxtPlugin({
  name: 'nuxt-auth-sanctum',
  async setup(_nuxtApp) {
    const nuxtApp = _nuxtApp as NuxtApp
    const options = useSanctumConfig()
    const logger = useSanctumLogger(options.logLevel)
    const client = createHttpClient(nuxtApp, logger)

    if (options.mode === 'token') {
      nuxtApp.hook(
        'page:loading:start',
        async () => {
          const tokenStorage = await resolveTokenStorage(nuxtApp, logger)
          await nuxtApp.runWithContext(() => useSanctumTokenStorage(tokenStorage))
        },
      )
    }

    if (options.client.initialRequest) {
      nuxtApp.hook(
        'page:loading:start',
        async () => {
          await initialIdentityLoad(nuxtApp, client, options, logger)
        },
      )
    }

    return {
      provide: {
        sanctumClient: client,
      },
    }
  },
})
