import { FetchError } from 'ofetch'
import { createConsola, type ConsolaInstance } from 'consola'
import { createHttpClient } from './httpFactory'
import { useSanctumUser } from './composables/useSanctumUser'
import { useSanctumConfig } from './composables/useSanctumConfig'
import { useSanctumAppConfig } from './composables/useSanctumAppConfig'
import { defineNuxtPlugin, updateAppConfig, useState } from '#app'

const LOGGER_NAME = 'nuxt-auth-sanctum'

function createSanctumLogger(logLevel: number) {
  const envSuffix = import.meta.env.SSR ? 'ssr' : 'csr'
  const loggerName = LOGGER_NAME + ':' + envSuffix

  return createConsola({ level: logLevel }).withTag(loggerName)
}

function handleIdentityLoadError(error: Error, logger: ConsolaInstance) {
  if (
    error instanceof FetchError
    && error.response
    && [401, 419].includes(error.response.status)
  ) {
    logger.debug(
      'User is not authenticated on plugin initialization, status:',
      error.response.status,
    )
  }
  else {
    logger.error('Unable to load user identity from API', error)
  }
}

export default defineNuxtPlugin(async () => {
  const user = useSanctumUser()
  const options = useSanctumConfig()
  const appConfig = useSanctumAppConfig()
  const logger = createSanctumLogger(options.logLevel)
  const client = createHttpClient(logger)

  if (options.mode === 'token' && !appConfig.tokenStorage) {
    logger.debug(
      'Token storage is not defined, switch to default cookie storage',
    )

    const defaultStorage = await import('./storages/cookieTokenStorage')

    updateAppConfig({
      sanctum: {
        tokenStorage: defaultStorage.cookieTokenStorage,
      },
    })
  }

  const identityFetchedOnInit = useState<boolean>(
    'sanctum.user.loaded',
    () => false,
  )

  if (user.value === null && identityFetchedOnInit.value === false) {
    identityFetchedOnInit.value = true

    try {
      logger.debug('Fetching user identity on plugin initialization')
      user.value = await client(options.endpoints.user!)
    }
    catch (error) {
      handleIdentityLoadError(error as Error, logger)
    }
  }

  return {
    provide: {
      sanctumClient: client,
    },
  }
})
