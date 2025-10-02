import type { $Fetch } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import { createHttpClient } from './httpFactory'
import { useSanctumUser } from './composables/useSanctumUser'
import { useSanctumConfig } from './composables/useSanctumConfig'
import { useSanctumAppConfig } from './composables/useSanctumAppConfig'
import type { PublicModuleOptions } from './types/options'
import { IDENTITY_LOADED_KEY } from './utils/constants'
import { useSanctumLogger } from './utils/logging'
import { defineNuxtPlugin, updateAppConfig, useState } from '#app'
import type { NuxtApp } from '#app'

async function setupDefaultTokenStorage(nuxtApp: NuxtApp, logger: ConsolaInstance) {
  logger.debug(
    'Token storage is not defined, switch to default cookie storage',
  )

  const defaultStorage = await import('./storages/cookieTokenStorage')

  nuxtApp.runWithContext(() => {
    updateAppConfig({
      sanctum: {
        tokenStorage: defaultStorage.cookieTokenStorage,
      },
    })
  })
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
      logger.error('Unable to load user identity from API', response.status)
    }
  }
  catch {
    logger.error('An unexpected error occurred while fetching user identity')
  }
}

export default defineNuxtPlugin({
  name: 'nuxt-auth-sanctum',
  async setup(_nuxtApp) {
    const nuxtApp = _nuxtApp as NuxtApp
    const options = useSanctumConfig()
    const appConfig = useSanctumAppConfig()
    const logger = useSanctumLogger(options.logLevel)
    const client = createHttpClient(nuxtApp, logger)

    if (options.mode === 'token' && !appConfig.tokenStorage) {
      await setupDefaultTokenStorage(nuxtApp, logger)
    }

    if (options.client.initialRequest) {
      nuxtApp.hook(
        'page:loading:start',
        async () => {
          await initialIdentityLoad(nuxtApp, client, options, logger)
        })
    }

    return {
      provide: {
        sanctumClient: client,
      },
    }
  },
})
