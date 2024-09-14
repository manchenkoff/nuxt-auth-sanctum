import { type Ref, computed } from 'vue'
import { trimTrailingSlash } from '../utils/formatter'
import { IDENTITY_LOADED_KEY } from '../utils/constants'
import { useSanctumClient } from './useSanctumClient'
import { useSanctumUser } from './useSanctumUser'
import { useSanctumConfig } from './useSanctumConfig'
import { useSanctumAppConfig } from './useSanctumAppConfig'
import { navigateTo, useNuxtApp, useRoute, useState } from '#app'

export interface SanctumAuth<T> {
  user: Ref<T | null>
  isAuthenticated: Ref<boolean>
  init: () => Promise<void>
  login: (credentials: Record<string, any>) => Promise<void>
  logout: () => Promise<void>
  refreshIdentity: () => Promise<void>
}

export type TokenResponse = {
  token: string
}

/**
 * Provides authentication methods for Laravel Sanctum
 *
 * @template T Type of the user object
 */
export const useSanctumAuth = <T>(): SanctumAuth<T> => {
  const nuxtApp = useNuxtApp()

  const user = useSanctumUser<T>()
  const client = useSanctumClient()
  const options = useSanctumConfig()
  const appConfig = useSanctumAppConfig()

  const isAuthenticated = computed(() => {
    return user.value !== null
  })

  const isIdentityLoaded = useState<boolean>(
    IDENTITY_LOADED_KEY,
    () => false,
  )

  /**
   * Initial request of the user identity for plugin initialization.
   * Only call this method when `sanctum.client.initialRequest` is false.
   */
  async function init() {
    if (isIdentityLoaded.value === true) {
      return
    }

    isIdentityLoaded.value = true
    await refreshIdentity()
  }

  /**
   * Fetches the user object from the API and sets it to the current state
   */
  async function refreshIdentity() {
    user.value = await client<T>(options.endpoints.user!)
  }

  /**
   * Calls the login endpoint and sets the user object to the current state
   *
   * @param credentials Credentials to pass to the login endpoint
   */
  async function login(credentials: Record<string, any>) {
    const currentRoute = useRoute()
    const currentPath = trimTrailingSlash(currentRoute.path)

    if (isAuthenticated.value === true) {
      if (options.redirectIfAuthenticated === false) {
        throw new Error('User is already authenticated')
      }

      if (
        options.redirect.onLogin === false
        || options.redirect.onLogin === currentPath
      ) {
        return
      }

      await nuxtApp.runWithContext(
        async () => await navigateTo(options.redirect.onLogin as string),
      )
    }

    const response = await client<TokenResponse>(options.endpoints.login!, {
      method: 'post',
      body: credentials,
    })

    if (options.mode === 'token') {
      await appConfig.tokenStorage!.set(nuxtApp, response.token)
    }

    await refreshIdentity()

    if (options.redirect.keepRequestedRoute) {
      const requestedRoute = currentRoute.query.redirect

      if (requestedRoute && requestedRoute !== currentPath) {
        await nuxtApp.runWithContext(
          async () => await navigateTo(requestedRoute as string),
        )

        return
      }
    }

    if (
      options.redirect.onLogin === false
      || currentRoute.path === options.redirect.onLogin
    ) {
      return
    }

    await nuxtApp.runWithContext(
      async () => await navigateTo(options.redirect.onLogin as string),
    )
  }

  /**
   * Calls the logout endpoint and clears the user object
   */
  async function logout() {
    if (isAuthenticated.value === false) {
      throw new Error('User is not authenticated')
    }

    const currentRoute = useRoute()
    const currentPath = trimTrailingSlash(currentRoute.path)

    await client(options.endpoints.logout!, { method: 'post' })

    user.value = null

    if (options.mode === 'token') {
      await appConfig.tokenStorage!.set(nuxtApp, undefined)
    }

    if (
      options.redirect.onLogout === false
      || currentPath === options.redirect.onLogout
    ) {
      return
    }

    await nuxtApp.runWithContext(
      async () => await navigateTo(options.redirect.onLogout as string),
    )
  }

  return {
    user,
    isAuthenticated,
    init,
    login,
    logout,
    refreshIdentity,
  } as SanctumAuth<T>
}
