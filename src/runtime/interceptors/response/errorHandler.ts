import type { FetchContext, FetchResponse } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import { useSanctumConfig } from '../../composables/useSanctumConfig'
import { useSanctumUser } from '../../composables/useSanctumUser'
import { navigateTo, type NuxtApp } from '#app'

/**
 * Handles error responses from the API.
 *
 * @param nuxtApp Nuxt application current instance.
 * @param context OFetch request/response context.
 * @param logger Module logger instance.
 */
export async function handleResponseError(
  nuxtApp: NuxtApp,
  context: FetchContext,
  logger: ConsolaInstance,
): Promise<void> {
  const options = useSanctumConfig()
  const user = useSanctumUser()

  const response = context.response as FetchResponse<unknown>

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
}
