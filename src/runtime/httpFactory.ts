import type { $Fetch, FetchContext, FetchOptions } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import { useSanctumUser } from './composables/useSanctumUser'
import { useSanctumConfig } from './composables/useSanctumConfig'
import { useSanctumAppConfig } from './composables/useSanctumAppConfig'
import type { SanctumAppConfig, SanctumInterceptor } from './types/config'
import { interceptors } from './interceptors'
import { navigateTo, type NuxtApp } from '#app'

/**
 * Returns a tuple of request and response interceptors.
 * Includes both module and user-defined interceptors.
 * @param appConfig Sanctum application configuration
 */
function useClientInterceptors(appConfig: SanctumAppConfig): [SanctumInterceptor[], SanctumInterceptor[]] {
  const [request, response] = [
    [...interceptors.request],
    [...interceptors.response],
  ]

  console.log(`Sanctum interceptors:`, request.length, response.length)

  if (appConfig.interceptors?.onRequest) {
    request.push(appConfig.interceptors.onRequest)
  }

  if (appConfig.interceptors?.onResponse) {
    response.push(appConfig.interceptors.onResponse)
  }

  return [request, response]
}

/**
 * Determines the credentials mode for the fetch request.
 */
function determineCredentialsMode() {
  // Fix for Cloudflare workers - https://github.com/cloudflare/workers-sdk/issues/2514
  const isCredentialsSupported = 'credentials' in Request.prototype

  if (!isCredentialsSupported) {
    return undefined
  }

  return 'include'
}

/**
 * Creates a custom OFetch instance with interceptors and Laravel-specific options.
 * @param nuxtApp Nuxt application instance
 * @param logger Module logger instance
 */
export function createHttpClient(nuxtApp: NuxtApp, logger: ConsolaInstance): $Fetch {
  const options = useSanctumConfig()
  const user = useSanctumUser()
  const appConfig = useSanctumAppConfig()

  const [
    requestInterceptors,
    responseInterceptors,
  ] = useClientInterceptors(appConfig)

  const httpOptions: FetchOptions = {
    baseURL: options.baseUrl,
    credentials: determineCredentialsMode(),
    redirect: 'manual',
    retry: options.client.retry === true ? 1 : options.client.retry, // false or number

    async onRequest(context: FetchContext): Promise<void> {
      for (const interceptor of requestInterceptors) {
        await nuxtApp.runWithContext(async () => {
          await interceptor(nuxtApp, context, logger)
        })
      }
    },

    async onResponse(context: FetchContext): Promise<void> {
      for (const interceptor of responseInterceptors) {
        await nuxtApp.runWithContext(async () => {
          await interceptor(nuxtApp, context, logger)
        })
      }
    },

    async onRequestError(context: FetchContext): Promise<void> {
      await nuxtApp.callHook('sanctum:error:request', context)
    },

    async onResponseError({ response }): Promise<void> {
      await nuxtApp.callHook('sanctum:error', response)

      if (response.status === 419) {
        logger.warn('CSRF token mismatch, check your API configuration')
        return
      }

      if (response.status === 401) {
        if (user.value !== null) {
          logger.warn('User session is not set in API or expired, resetting identity')
          user.value = null
        }

        if (
          import.meta.client
            && options.redirectIfUnauthenticated
            && options.redirect.onAuthOnly
        ) {
          const redirectUrl = options.redirect.onAuthOnly

          await nuxtApp.callHook('sanctum:redirect', redirectUrl)
          await nuxtApp.runWithContext(async () => await navigateTo(redirectUrl))
        }
      }
    },
  }

  return $fetch.create(httpOptions) as $Fetch
}
