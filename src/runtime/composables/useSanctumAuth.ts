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
  login: (credentials: Record<string, unknown>, fetchIdentity?: boolean) => Promise<unknown>
  logout: () => Promise<void>
  refreshIdentity: () => Promise<void>
}

export type TokenResponse = {
  token?: string
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
    if (isIdentityLoaded.value) {
      return
    }

    isIdentityLoaded.value = true

    await refreshIdentity()
    await nuxtApp.callHook('sanctum:init')
  }

  /**
   * Fetches the user object from the API and sets it to the current state
   */
  async function refreshIdentity() {
    user.value = await client<T>(options.endpoints.user!)
    await nuxtApp.callHook('sanctum:refresh')
  }

  /**
   * Calls the login endpoint and sets the user object to the current state
   *
   * @param credentials Credentials to pass to the login endpoint
   * @param fetchIdentity Determines whether user identity should be fetched on successful response
   */
  async function login(credentials: Record<string, unknown>, fetchIdentity: boolean = true): Promise<unknown> {
    const currentRoute = useRoute()
    const currentPath = trimTrailingSlash(currentRoute.path)

    if (isAuthenticated.value) {
      if (!options.redirectIfAuthenticated) {
        throw new Error('User is already authenticated')
      }

      if (
        options.redirect.onLogin === false
        || options.redirect.onLogin === currentPath
      ) {
        return
      }

      if (options.redirect.onLogin === undefined) {
        throw new Error('`sanctum.redirect.onLogin` is not defined')
      }

      const redirectUrl = options.redirect.onLogin as string

      await nuxtApp.callHook('sanctum:redirect', redirectUrl)
      await nuxtApp.runWithContext(async () => await navigateTo(redirectUrl))
    }

    if (options.endpoints.login === undefined) {
      throw new Error('`sanctum.endpoints.login` is not defined')
    }

    const response = await client<TokenResponse>(options.endpoints.login, {
      method: 'post',
      body: credentials,
    })

    if (options.mode === 'token') {
      if (appConfig.tokenStorage === undefined) {
        throw new Error('`sanctum.tokenStorage` is not defined in app.config.ts')
      }

      if (response.token === undefined) {
        throw new Error('Token was not returned from the API')
      }

      await appConfig.tokenStorage.set(nuxtApp, response.token)
    }

    if (fetchIdentity) {
      await refreshIdentity()
    }

    await nuxtApp.callHook('sanctum:login')

    if (options.redirect.keepRequestedRoute) {
      const requestedRoute = currentRoute.query.redirect as string | undefined

      if (requestedRoute && requestedRoute !== currentPath) {
        await nuxtApp.callHook('sanctum:redirect', requestedRoute)
        await nuxtApp.runWithContext(async () => await navigateTo(requestedRoute))
        return response
      }
    }

    if (
      options.redirect.onLogin === false
      || currentRoute.path === options.redirect.onLogin
    ) {
      return response
    }

    if (options.redirect.onLogin === undefined) {
      throw new Error('`sanctum.redirect.onLogin` is not defined')
    }

    const redirectUrl = options.redirect.onLogin as string

    await nuxtApp.callHook('sanctum:redirect', redirectUrl)
    await nuxtApp.runWithContext(async () => await navigateTo(redirectUrl))

    return response
  }

  /**
   * Calls the logout endpoint and clears the user object
   */
  async function logout() {
    if (!isAuthenticated.value) {
      throw new Error('User is not authenticated')
    }

    const currentRoute = useRoute()
    const currentPath = trimTrailingSlash(currentRoute.path)

    if (options.endpoints.logout === undefined) {
      throw new Error('`sanctum.endpoints.logout` is not defined')
    }

    await client(options.endpoints.logout, { method: 'post' })

    user.value = null
    await nuxtApp.callHook('sanctum:logout')

    if (options.mode === 'token') {
      if (appConfig.tokenStorage === undefined) {
        throw new Error('`sanctum.tokenStorage` is not defined in app.config.ts')
      }

      await appConfig.tokenStorage.set(nuxtApp, undefined)
    }

    if (
      options.redirect.onLogout === false
      || currentPath === options.redirect.onLogout
    ) {
      return
    }

    if (options.redirect.onLogout === undefined) {
      throw new Error('`sanctum.redirect.onLogout` is not defined')
    }

    const redirectUrl = options.redirect.onLogout as string

    await nuxtApp.callHook('sanctum:redirect', redirectUrl)
    await nuxtApp.runWithContext(async () => await navigateTo(redirectUrl))
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
