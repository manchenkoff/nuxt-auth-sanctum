import type { $Fetch, FetchResponse } from 'ofetch'
import { createConsola, type ConsolaInstance } from 'consola'
import { createHttpClient } from './httpFactory'
import { useSanctumUser } from './composables/useSanctumUser'
import { useSanctumConfig } from './composables/useSanctumConfig'
import { useSanctumAppConfig } from './composables/useSanctumAppConfig'
import type { ModuleOptions } from './types/options'
import { IDENTITY_LOADED_KEY } from './utils/constants'
import { defineNuxtPlugin, updateAppConfig, useState, type NuxtApp } from '#app'

const LOGGER_NAME = 'nuxt-auth-sanctum'

function createSanctumLogger(logLevel: number) {
  const envSuffix = import.meta.server ? 'ssr' : 'csr'
  const loggerName = LOGGER_NAME + ':' + envSuffix

  return createConsola({ level: logLevel }).withTag(loggerName)
}

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

async function initialIdentityLoad(nuxtApp: NuxtApp, client: $Fetch, options: ModuleOptions, logger: ConsolaInstance) {
  const user = useSanctumUser()

  const identityFetchedOnInit = useState<boolean>(
    IDENTITY_LOADED_KEY,
    () => false,
  )

  if (user.value === null && !identityFetchedOnInit.value) {
    identityFetchedOnInit.value = true

    logger.debug('Fetching user identity on plugin initialization')

    if (!options.endpoints.user) {
      throw new Error('`sanctum.endpoints.user` is not defined')
    }

    const response = await client.raw(
      options.endpoints.user,
      { ignoreResponseError: true },
    )

    if (response.ok) {
      user.value = response._data
      return await nuxtApp.callHook('sanctum:init')
    }

    handleIdentityLoadError(response, logger)
  }
}

function handleIdentityLoadError(response: FetchResponse<unknown>, logger: ConsolaInstance) {
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

export default defineNuxtPlugin({
  name: 'nuxt-auth-sanctum',
  async setup(_nuxtApp) {
    const nuxtApp = _nuxtApp as NuxtApp
    const options = useSanctumConfig()
    const appConfig = useSanctumAppConfig()
    const logger = createSanctumLogger(options.logLevel)
    const client = createHttpClient(nuxtApp, logger)

    if (options.mode === 'token' && !appConfig.tokenStorage) {
      await setupDefaultTokenStorage(nuxtApp, logger)
    }

    if (options.client.initialRequest) {
      await initialIdentityLoad(nuxtApp, client, options, logger)
    }

    return {
      provide: {
        sanctumClient: client,
      },
    }
  },
})
