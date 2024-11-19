import { unref } from 'vue'
import type { TokenStorage } from '../types/config'
import { useCookie, type NuxtApp, useRequestURL } from '#app'

const cookieTokenKey = 'sanctum.token.cookie'

/**
 * Token storage using a secure cookie for HTTPS and plain cookie for HTTP.
 * Works with both CSR/SSR modes.
 */
export const cookieTokenStorage: TokenStorage = {
  async get(app: NuxtApp) {
    return app.runWithContext(() => {
      const cookie = useCookie(cookieTokenKey, { readonly: true })
      return unref(cookie.value) ?? undefined
    })
  },

  async set(app: NuxtApp, token?: string) {
    await app.runWithContext(() => {
      const isSecure = useRequestURL().protocol.startsWith('https')
      const cookie = useCookie(cookieTokenKey, { secure: isSecure })
      cookie.value = token
    })
  },
}
