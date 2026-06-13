import type { FetchContext, FetchResponse } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import type { RouteLocationAsPathGeneric } from 'vue-router'
import { useSanctumConfig } from '../../composables/useSanctumConfig'
import { useSanctumUser } from '../../composables/useSanctumUser'
import { navigateTo, useRouter } from '#app'
import type { NuxtApp } from '#app'
import { isServerRuntime } from '../../utils/runtime'
import { trimTrailingSlash } from '../../utils/formatter'

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
  const router = useRouter()

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
      isServerRuntime() === false
      && options.redirectIfUnauthenticated
      && options.redirect.onAuthOnly
    ) {
      const redirect: RouteLocationAsPathGeneric = { path: options.redirect.onAuthOnly }

      if (options.redirect.keepRouteOnUnauthenticated) {
        const currentPath = router.currentRoute.value.fullPath

        redirect.query = { redirect: trimTrailingSlash(currentPath) }
      }

      await nuxtApp.callHook('sanctum:redirect', router.resolve(redirect).fullPath)
      await nuxtApp.runWithContext(async () => await navigateTo(redirect))
    }
  }
}
