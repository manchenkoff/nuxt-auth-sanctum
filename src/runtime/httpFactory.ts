import type { FetchContext, FetchOptions } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import { useSanctumConfig } from './composables/useSanctumConfig'
import type { SanctumInterceptor } from './types/config'
import { interceptors } from './interceptors'
import { determineCredentialsMode } from './utils/credentials'
import type { SanctumFetch } from './types/fetch'
import type { NuxtApp } from '#app'

/**
 * Returns a tuple of request and response interceptors.
 */
function useClientInterceptors(): [
  SanctumInterceptor[],
  SanctumInterceptor[],
  SanctumInterceptor[],
] {
  const [request, response, responseError] = [
    [...interceptors.request],
    [...interceptors.response],
    [...interceptors.responseError],
  ]

  return [request, response, responseError]
}

/**
 * Creates a custom OFetch instance with interceptors and Laravel-specific options.
 *
 * @param nuxtApp Nuxt application instance
 * @param logger Module logger instance
 */
export function createHttpClient(nuxtApp: NuxtApp, logger: ConsolaInstance): SanctumFetch {
  const options = useSanctumConfig()

  const [
    requestInterceptors,
    responseInterceptors,
    responseErrorInterceptors,
  ] = useClientInterceptors()

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

      await nuxtApp.callHook('sanctum:request', nuxtApp, context, logger)
    },

    async onResponse(context: FetchContext): Promise<void> {
      for (const interceptor of responseInterceptors) {
        await nuxtApp.runWithContext(async () => {
          await interceptor(nuxtApp, context, logger)
        })
      }

      await nuxtApp.callHook('sanctum:response', nuxtApp, context, logger)
    },

    async onRequestError(context: FetchContext): Promise<void> {
      await nuxtApp.callHook('sanctum:error:request', context)
    },

    async onResponseError(context): Promise<void> {
      for (const interceptor of responseErrorInterceptors) {
        await nuxtApp.runWithContext(async () => {
          await interceptor(nuxtApp, context, logger)
        })
      }

      await nuxtApp.callHook('sanctum:error:response', context)
    },
  }

  return $fetch.create(httpOptions) as SanctumFetch
}
