import { useCookie, useNuxtApp } from '#app'
import { unref } from 'vue'
import { useSanctumLogger } from '../utils/logging'
import { useSanctumConfig } from '../composables/useSanctumConfig'
import { useSanctumAppConfig } from '../composables/useSanctumAppConfig'
import { useSanctumAuth } from '../composables/useSanctumAuth'

/**
 * Validates existence of the current user session details
 */
export async function isUserSessionActive(): Promise<boolean> {
  const nuxtApp = useNuxtApp()
  const options = useSanctumConfig()
  const appConfig = useSanctumAppConfig()
  const { isAuthenticated, refreshIdentity } = useSanctumAuth()

  if (isAuthenticated.value === false) {
    return false
  }

  const logger = useSanctumLogger(options.logLevel)

  if (options.mode == 'cookie') {
    const csrfToken = unref(
      useCookie(
        options.csrf.cookie!,
        { readonly: true, watch: false },
      ),
    )

    if (!csrfToken) {
      try {
        logger.debug('[sanctum] csrf cookie is outdated, refreshing identity')
        await refreshIdentity()
      }
      catch {
        logger.debug('[sanctum] unable to refresh identity on route change')
      }
    }
  }

  if (options.mode == 'token') {
    const token = await appConfig.tokenStorage!.get(nuxtApp)

    if (!token) {
      try {
        logger.debug('[sanctum] csrf token is outdated, refreshing identity')
        await refreshIdentity()
      }
      catch {
        logger.debug('[sanctum] unable to refresh identity on route change')
      }
    }
  }

  return isAuthenticated.value
}
