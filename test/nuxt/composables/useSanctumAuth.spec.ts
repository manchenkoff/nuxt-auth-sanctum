import { useNuxtApp, useRouter, useState } from '#app'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import defu from 'defu'
import { ofetch } from 'ofetch'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSanctumAuth } from '~/src/runtime/composables/useSanctumAuth'
import { useSanctumTokenStorage } from '~/src/runtime/composables/useSanctumTokenStorage'
import { useSanctumUser } from '~/src/runtime/composables/useSanctumUser'
import type { ModuleOptions } from '~/src/runtime/types/options'

const
  USER_RESPONSE = {
    id: 1,
    email: 'admin@test.com',
  },
  USER_CREDENTIALS = {
    login: 'admin@test.com',
    password: 'pass123',
  },
  CONFIG: ModuleOptions = {
    baseUrl: '/',
    mode: 'cookie',
    userStateKey: 'sanctum.user.identity',
    redirectIfAuthenticated: false,
    redirectIfUnauthenticated: false,
    endpoints: {
      csrf: '/sanctum/csrf-cookie',
      login: '/api/login',
      logout: '/api/logout',
      user: '/api/user',
    },
    csrf: {
      cookie: 'XSRF-TOKEN',
      header: 'X-XSRF-TOKEN',
    },
    client: {
      retry: false,
      initialRequest: true,
    },
    redirect: {
      keepRequestedRoute: false,
      onLogin: false,
      onLogout: false,
      onAuthOnly: false,
      onGuestOnly: false,
    },
    globalMiddleware: {
      enabled: false,
      prepend: false,
      allow404WithoutAuth: true,
    },
    logLevel: 3,
    appendPlugin: false,
    serverProxy: {
      enabled: false,
      route: '/api/sanctum',
      baseUrl: 'http://localhost:80',
    },
  }

const
  fetchInstance = ofetch.create({}),
  fetchSpy = vi.fn(fetchInstance)

const {
  useSanctumClientMock,
  useSanctumConfigMock,
} = vi.hoisted(() => ({
  useSanctumClientMock: vi.fn(() => fetchSpy),
  useSanctumConfigMock: vi.fn(() => CONFIG),
}))

vi.mock(
  '~/src/runtime/composables/useSanctumClient',
  () => ({ useSanctumClient: useSanctumClientMock }),
)

vi.mock(
  '~/src/runtime/composables/useSanctumConfig',
  () => ({ useSanctumConfig: useSanctumConfigMock }),
)

registerEndpoint('/api/user', () => USER_RESPONSE)
registerEndpoint('/api/login', () => ({ token: '123123' }))
registerEndpoint('/api/logout', () => ({ success: true }))

function stubConfigMock(overrides: Partial<ModuleOptions> = {}): void {
  const config = defu(overrides, structuredClone(CONFIG)) as ModuleOptions

  useSanctumConfigMock.mockReturnValue(config)
}

describe('useSanctumAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    useSanctumConfigMock.mockReset().mockReturnValue(CONFIG)
    useSanctumUser().value = null
    useState('sanctum.user.loaded').value = false
    useRouter().replace('/')
  })

  it('user - returns null when user is not set', () => {
    const { user } = useSanctumAuth()

    expect(user.value).toBeNull()
  })

  it('user - returns identity when user is set', () => {
    const identity = useSanctumUser()

    identity.value = { id: 1, name: 'john' }

    const { user } = useSanctumAuth()

    expect(user.value).toStrictEqual(identity.value)
  })

  it('isAuthenticated - returns false when user is not set', () => {
    const { user, isAuthenticated } = useSanctumAuth()

    expect(user.value).toBeNull()
    expect(isAuthenticated.value).toBeFalsy()
  })

  it('isAuthenticated - returns true when user is set', () => {
    const identity = useSanctumUser()

    identity.value = { id: 1, name: 'john' }

    const { user, isAuthenticated } = useSanctumAuth()

    expect(user.value).toStrictEqual(identity.value)
    expect(isAuthenticated.value).toBeTruthy()
  })

  it('init - refreshes identity if not requested yet and calls hook', async () => {
    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { init, user, isAuthenticated } = useSanctumAuth()

    await init()

    expect(hookSpy).toHaveBeenCalledWith('sanctum:init')
    expect(fetchSpy).toHaveBeenCalledWith('/api/user')
    expect(user.value).toStrictEqual(USER_RESPONSE)
    expect(isAuthenticated.value).toBeTruthy()
  })

  it('init - does not refresh identity if previously requested', async () => {
    useState('sanctum.user.loaded').value = true

    const { init, user, isAuthenticated } = useSanctumAuth()

    await init()

    expect(fetchSpy).not.toHaveBeenCalled()
    expect(user.value).toBeNull()
    expect(isAuthenticated.value).toBeFalsy()
  })

  it('init - does not refresh identity on second call', async () => {
    const { init, user, isAuthenticated } = useSanctumAuth()

    await init()
    await init()

    expect(fetchSpy).toHaveBeenCalledExactlyOnceWith('/api/user')
    expect(user.value).toStrictEqual(USER_RESPONSE)
    expect(isAuthenticated.value).toBeTruthy()
  })

  it('login - throws error when redirectIfAuthenticated is disabled', async () => {
    const { login, user } = useSanctumAuth()

    user.value = USER_RESPONSE

    await expect(login(USER_CREDENTIALS))
      .rejects
      .toThrow('User is already authenticated')
  })

  it('login - no-op when onLogin route is disabled', async () => {
    stubConfigMock({
      redirectIfAuthenticated: true,
      redirect: {
        onLogin: false,
      },
    })

    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { login, user } = useSanctumAuth()

    user.value = USER_RESPONSE

    const response = await login(USER_CREDENTIALS)

    expect(response).toBeUndefined()
    expect(hookSpy).not.toHaveBeenCalledWith('sanctum:redirect', expect.anything())
  })

  it('login - no-op when onLogin route is the current route', async () => {
    stubConfigMock({
      redirectIfAuthenticated: true,
      redirect: {
        onLogin: '/',
      },
    })

    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { login, user } = useSanctumAuth()

    user.value = USER_RESPONSE

    const response = await login(USER_CREDENTIALS)

    expect(response).toBeUndefined()
    expect(hookSpy).not.toHaveBeenCalledWith('sanctum:redirect', expect.anything())
  })

  it('login - throws error when onLogin is undefined', async () => {
    const options = defu({ redirectIfAuthenticated: true }, structuredClone(CONFIG)) as unknown as ModuleOptions

    options.redirect.onLogin = undefined

    useSanctumConfigMock.mockReturnValue(options)

    const { login, user } = useSanctumAuth()

    user.value = USER_RESPONSE

    await expect(login(USER_CREDENTIALS))
      .rejects
      .toThrow('`sanctum.redirect.onLogin` is not defined')
  })

  it('login - calls hook and performs redirect', async () => {
    stubConfigMock({
      redirectIfAuthenticated: true,
      redirect: {
        onLogin: '/dashboard',
      },
    })

    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { login, user } = useSanctumAuth()

    user.value = USER_RESPONSE

    const response = await login(USER_CREDENTIALS)

    expect(response).toBeDefined()
    expect(hookSpy).toHaveBeenCalledWith('sanctum:redirect', '/dashboard')
  })

  it('login - throws error when login endpoint is undefined', async () => {
    const options = defu({ endpoints: {} }, structuredClone(CONFIG)) as unknown as ModuleOptions

    options.endpoints.login = undefined

    useSanctumConfigMock.mockReturnValue(options)

    const { login } = useSanctumAuth()

    await expect(login(USER_CREDENTIALS))
      .rejects
      .toThrow('`sanctum.endpoints.login` is not defined')
  })

  it('login - calls refreshIdentity and hook on successful login', async () => {
    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { login, user } = useSanctumAuth()

    const response = await login(USER_CREDENTIALS)

    expect(fetchSpy).toHaveBeenCalledWith('/api/login', {
      method: 'post',
      body: USER_CREDENTIALS,
    })
    expect(fetchSpy).toHaveBeenCalledWith('/api/user')
    expect(hookSpy).toHaveBeenCalledWith('sanctum:refresh')
    expect(hookSpy).toHaveBeenCalledWith('sanctum:login')
    expect(response).toBeDefined()
    expect(user.value).toStrictEqual(USER_RESPONSE)
    expect(hookSpy).not.toHaveBeenCalledWith('sanctum:redirect', expect.anything())
  })

  it('login - throws error on failed response', async () => {
    stubConfigMock({
      endpoints: {
        login: '/404',
      },
    })

    const { login } = useSanctumAuth()

    await expect(login(USER_CREDENTIALS))
      .rejects
      .toThrow('[POST] "/404": 404 Cannot find any path matching /404.')
  })

  it('login - does not refreshIdentity if disabled', async () => {
    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { login, user } = useSanctumAuth()

    const response = await login(USER_CREDENTIALS, false)

    expect(fetchSpy).toHaveBeenCalledWith('/api/login', {
      method: 'post',
      body: USER_CREDENTIALS,
    })
    expect(fetchSpy).not.toHaveBeenCalledWith('/api/user')
    expect(hookSpy).not.toHaveBeenCalledWith('sanctum:refresh')
    expect(hookSpy).toHaveBeenCalledWith('sanctum:login')
    expect(response).toBeDefined()
    expect(user.value).toBeNull()
    expect(hookSpy).not.toHaveBeenCalledWith('sanctum:redirect', expect.anything())
  })

  it('login - throws error if tokenStorage is undefined in token mode', async () => {
    stubConfigMock({
      mode: 'token',
    })

    const { login } = useSanctumAuth()

    await expect(login(USER_CREDENTIALS))
      .rejects
      .toThrow('`sanctum.tokenStorage` is not defined in app.config.ts')
  })

  it('login - throws error if token is not returned from the API', async () => {
    registerEndpoint('/api/login-no-token', () => ({}))

    stubConfigMock({
      mode: 'token',
      endpoints: {
        login: '/api/login-no-token',
      },
    })

    const
      getTokenMock = vi.fn(),
      setTokenMock = vi.fn()

    useSanctumTokenStorage({
      get: getTokenMock,
      set: setTokenMock,
    })

    const { login } = useSanctumAuth()

    await expect(login(USER_CREDENTIALS))
      .rejects
      .toThrow('Token was not returned from the API')
  })

  it('login - sets token from response in token mode', async () => {
    stubConfigMock({
      mode: 'token',
    })

    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const
      getTokenMock = vi.fn(),
      setTokenMock = vi.fn()

    useSanctumTokenStorage({
      get: getTokenMock,
      set: setTokenMock,
    })

    const { login, user } = useSanctumAuth()

    const response = await login(USER_CREDENTIALS)

    expect(fetchSpy).toHaveBeenCalledWith('/api/login', {
      method: 'post',
      body: USER_CREDENTIALS,
    })
    expect(setTokenMock).toHaveBeenCalledWith(app, '123123')
    expect(fetchSpy).toHaveBeenCalledWith('/api/user')
    expect(hookSpy).toHaveBeenCalledWith('sanctum:refresh')
    expect(hookSpy).toHaveBeenCalledWith('sanctum:login')
    expect(response).toBeDefined()
    expect(user.value).toStrictEqual(USER_RESPONSE)
    expect(hookSpy).not.toHaveBeenCalledWith('sanctum:redirect', expect.anything())
  })

  it('login - redirects to previously blocked route when keepRequestedRoute is enabled', async () => {
    stubConfigMock({
      redirect: {
        keepRequestedRoute: true,
      },
    })

    await useRouter().replace('/?redirect=/protected')

    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { login, user } = useSanctumAuth()

    const response = await login(USER_CREDENTIALS)

    expect(fetchSpy).toHaveBeenCalledWith('/api/login', {
      method: 'post',
      body: USER_CREDENTIALS,
    })
    expect(fetchSpy).toHaveBeenCalledWith('/api/user')
    expect(hookSpy).toHaveBeenCalledWith('sanctum:refresh')
    expect(hookSpy).toHaveBeenCalledWith('sanctum:login')
    expect(response).toBeDefined()
    expect(user.value).toStrictEqual(USER_RESPONSE)
    expect(hookSpy).toHaveBeenCalledWith('sanctum:redirect', '/protected')
  })

  it('login - returns response if onLogin redirect is disabled', async () => {
    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { login, user } = useSanctumAuth()

    const response = await login(USER_CREDENTIALS)

    expect(fetchSpy).toHaveBeenCalledWith('/api/login', {
      method: 'post',
      body: USER_CREDENTIALS,
    })
    expect(fetchSpy).toHaveBeenCalledWith('/api/user')
    expect(hookSpy).toHaveBeenCalledWith('sanctum:refresh')
    expect(hookSpy).toHaveBeenCalledWith('sanctum:login')
    expect(response).toBeDefined()
    expect(user.value).toStrictEqual(USER_RESPONSE)
    expect(hookSpy).not.toHaveBeenCalledWith('sanctum:redirect', expect.anything())
  })

  it('login - throws error when onLogin redirect is undefined', async () => {
    const options = defu({ redirect: {} }, CONFIG) as unknown as ModuleOptions

    options.redirect.onLogin = undefined

    useSanctumConfigMock.mockReturnValue(options)

    const { login } = useSanctumAuth()

    await expect(login(USER_CREDENTIALS))
      .rejects
      .toThrow('`sanctum.redirect.onLogin` is not defined')
  })

  it('login - redirects to onLogin if keepRequestedRoute is disabled', async () => {
    stubConfigMock({
      redirect: {
        keepRequestedRoute: false,
        onLogin: '/dashboard',
      },
    })

    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { login, user } = useSanctumAuth()

    const response = await login(USER_CREDENTIALS)

    expect(fetchSpy).toHaveBeenCalledWith('/api/login', {
      method: 'post',
      body: USER_CREDENTIALS,
    })
    expect(fetchSpy).toHaveBeenCalledWith('/api/user')
    expect(hookSpy).toHaveBeenCalledWith('sanctum:refresh')
    expect(hookSpy).toHaveBeenCalledWith('sanctum:login')
    expect(response).toBeDefined()
    expect(user.value).toStrictEqual(USER_RESPONSE)
    expect(hookSpy).toHaveBeenCalledWith('sanctum:redirect', '/dashboard')
  })

  it('login - passes user options to fetch request', async () => {
    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { login, user } = useSanctumAuth()

    const response = await login(USER_CREDENTIALS, true, { headers: { 'X-Custom-Header': 'value' } })

    expect(fetchSpy).toHaveBeenCalledWith('/api/login', {
      method: 'post',
      body: USER_CREDENTIALS,
      headers: { 'X-Custom-Header': 'value' },
    })
    expect(fetchSpy).toHaveBeenCalledWith('/api/user')
    expect(hookSpy).toHaveBeenCalledWith('sanctum:refresh')
    expect(hookSpy).toHaveBeenCalledWith('sanctum:login')
    expect(response).toBeDefined()
    expect(user.value).toStrictEqual(USER_RESPONSE)
    expect(hookSpy).not.toHaveBeenCalledWith('sanctum:redirect', expect.anything())
  })

  it('logout - throws error if not authenticated', async () => {
    const { logout } = useSanctumAuth()

    await expect(logout())
      .rejects
      .toThrow('User is not authenticated')
  })

  it('logout - throws error if logout endpoint is undefined', async () => {
    const options = defu({ endpoints: {} }, structuredClone(CONFIG)) as unknown as ModuleOptions

    options.endpoints.logout = undefined

    useSanctumConfigMock.mockReturnValue(options)

    const { logout, user } = useSanctumAuth()

    user.value = USER_RESPONSE

    await expect(logout())
      .rejects
      .toThrow('`sanctum.endpoints.logout` is not defined')
  })

  it('logout - resets user state after logout and calls hook', async () => {
    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { logout, user } = useSanctumAuth()

    user.value = USER_RESPONSE

    await logout()

    expect(hookSpy).toHaveBeenCalledWith('sanctum:logout')
    expect(fetchSpy).toHaveBeenCalledWith('/api/logout', { method: 'post' })
    expect(user.value).toBeNull()
  })

  it('logout - resets token in storage in token mode', async () => {
    stubConfigMock({
      mode: 'token',
    })

    const
      storageGetMock = vi.fn(),
      storageSetMock = vi.fn()

    useSanctumTokenStorage({
      get: storageGetMock,
      set: storageSetMock,
    })

    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { logout, user } = useSanctumAuth()

    user.value = USER_RESPONSE

    await logout()

    expect(hookSpy).toHaveBeenCalledWith('sanctum:logout')
    expect(fetchSpy).toHaveBeenCalledWith('/api/logout', { method: 'post' })
    expect(user.value).toBeNull()
    expect(storageSetMock).toHaveBeenCalledWith(app, undefined)
  })

  it('logout - does not redirect if onLogout is disabled', async () => {
    stubConfigMock({
      redirect: {
        onLogout: false,
      },
    })

    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { logout, user } = useSanctumAuth()

    user.value = USER_RESPONSE

    await logout()

    expect(hookSpy).toHaveBeenCalledWith('sanctum:logout')
    expect(fetchSpy).toHaveBeenCalledWith('/api/logout', { method: 'post' })
    expect(user.value).toBeNull()
    expect(hookSpy).not.toHaveBeenCalledWith('sanctum:redirect', expect.anything())
  })

  it('logout - does not redirect if onLogout is the current route', async () => {
    stubConfigMock({
      redirect: {
        onLogout: '/',
      },
    })

    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { logout, user } = useSanctumAuth()

    user.value = USER_RESPONSE

    await logout()

    expect(hookSpy).toHaveBeenCalledWith('sanctum:logout')
    expect(fetchSpy).toHaveBeenCalledWith('/api/logout', { method: 'post' })
    expect(user.value).toBeNull()
    expect(hookSpy).not.toHaveBeenCalledWith('sanctum:redirect', expect.anything())
  })

  it('logout - throws error if onLogout is undefined', async () => {
    const options = defu({ redirect: {} }, structuredClone(CONFIG)) as unknown as ModuleOptions

    options.redirect.onLogout = undefined

    useSanctumConfigMock.mockReturnValue(options)

    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { logout, user } = useSanctumAuth()

    user.value = USER_RESPONSE

    await expect(logout())
      .rejects
      .toThrow('`sanctum.redirect.onLogout` is not defined')

    expect(hookSpy).toHaveBeenCalledWith('sanctum:logout')
    expect(fetchSpy).toHaveBeenCalledWith('/api/logout', { method: 'post' })
    expect(user.value).toBeNull()
    expect(hookSpy).not.toHaveBeenCalledWith('sanctum:redirect', expect.anything())
  })

  it('logout - redirects to onLogout after successful response', async () => {
    stubConfigMock({
      redirect: {
        onLogout: '/bye',
      },
    })

    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { logout, user } = useSanctumAuth()

    user.value = USER_RESPONSE

    await logout()

    expect(hookSpy).toHaveBeenCalledWith('sanctum:logout')
    expect(fetchSpy).toHaveBeenCalledWith('/api/logout', { method: 'post' })
    expect(user.value).toBeNull()
    expect(hookSpy).toHaveBeenCalledWith('sanctum:redirect', '/bye')
  })

  it('logout - throws error on failed response', async () => {
    stubConfigMock({
      endpoints: {
        logout: '/404',
      },
    })

    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { logout, user } = useSanctumAuth()

    user.value = USER_RESPONSE

    await expect(logout())
      .rejects
      .toThrow('[POST] "/404": 404 Cannot find any path matching /404.')

    expect(hookSpy).not.toHaveBeenCalledWith('sanctum:logout')
    expect(fetchSpy).toHaveBeenCalledWith('/404', { method: 'post' })
    expect(user.value).toStrictEqual(USER_RESPONSE)
  })

  it('logout - passes user options to fetch request', async () => {
    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { logout, user } = useSanctumAuth()

    user.value = USER_RESPONSE

    await logout({ headers: { 'X-Custom-Header': 'value' } })

    expect(hookSpy).toHaveBeenCalledWith('sanctum:logout')
    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/logout',
      {
        method: 'post',
        headers: { 'X-Custom-Header': 'value' },
      },
    )
    expect(user.value).toBeNull()
  })

  it('refreshIdentity - fetches user and calls hook', async () => {
    const app = useNuxtApp()
    const hookSpy = vi.spyOn(app, 'callHook')

    const { refreshIdentity } = useSanctumAuth()

    await refreshIdentity()

    const user = useSanctumUser()

    expect(hookSpy).toHaveBeenCalledWith('sanctum:refresh')
    expect(fetchSpy).toHaveBeenCalledWith('/api/user')
    expect(user.value).toStrictEqual(USER_RESPONSE)
  })
})
