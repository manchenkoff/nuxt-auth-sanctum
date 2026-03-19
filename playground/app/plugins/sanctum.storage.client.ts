import type { NuxtApp } from '#app'
import type { TokenStorage } from '../../../src/runtime/types/config'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('sanctum:storage:token', () => {
    const tokenStorageKey = 'sanctum.storage.token'

    const localTokenStorage: TokenStorage = {
      get: async () => {
        if (import.meta.server) {
          return undefined
        }

        return window.localStorage.getItem(tokenStorageKey) ?? undefined
      },

      set: async (_app: NuxtApp, token?: string) => {
        if (import.meta.server) {
          return
        }

        if (!token) {
          window.localStorage.removeItem(tokenStorageKey)
          return
        }

        window.localStorage.setItem(tokenStorageKey, token)
      },
    }

    useSanctumTokenStorage(localTokenStorage)
  })
})
