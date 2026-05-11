import { useCookie, useNuxtApp } from '#imports'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import defu from 'defu'
import { ofetch } from 'ofetch'
import { nextTick } from 'vue'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useSanctumUser } from '~/src/runtime/composables/useSanctumUser'
import { useSanctumTokenStorage } from '~/src/runtime/composables/useSanctumTokenStorage'
import type { ModuleOptions } from '~/src/runtime/types/options'
import { isUserSessionActive } from '~/src/runtime/utils/session'

const
  USER_RESPONSE = {
    id: 1,
    email: 'admin@test.com',
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

function stubConfigMock(overrides: Partial<ModuleOptions> = {}): void {
  const config = defu(overrides, structuredClone(CONFIG)) as ModuleOptions

  useSanctumConfigMock.mockReturnValue(config)
}

describe('session', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    useSanctumConfigMock.mockReset().mockReturnValue(CONFIG)
    useSanctumUser().value = null
  })

  describe('isUserSessionActive', () => {
    it('returns false when isAuthenticated is false', async () => {
      const result = await isUserSessionActive()

      expect(result).toBeFalsy()
    })

    it('refreshes identity if cookie is expired', async () => {
      useSanctumUser().value = USER_RESPONSE

      const app = useNuxtApp()
      const hookSpy = vi.spyOn(app, 'callHook')

      const result = await isUserSessionActive()

      expect(fetchSpy).toHaveBeenCalledWith('/api/user')
      expect(hookSpy).toHaveBeenCalledWith('sanctum:refresh')
      expect(result).toBeTruthy()
    })

    it('does not refresh identity when cookie is valid', async () => {
      useSanctumUser().value = USER_RESPONSE
      useCookie('XSRF-TOKEN').value = 'cookie-value'

      await nextTick()

      const app = useNuxtApp()
      const hookSpy = vi.spyOn(app, 'callHook')

      const result = await isUserSessionActive()

      expect(fetchSpy).not.toHaveBeenCalledWith('/api/user')
      expect(hookSpy).not.toHaveBeenCalledWith('sanctum:refresh')
      expect(result).toBeTruthy()
    })

    it('refreshes identity if token is expired', async () => {
      stubConfigMock({
        mode: 'token',
      })

      useSanctumUser().value = USER_RESPONSE

      const
        getTokenMock = vi.fn(),
        setTokenMock = vi.fn()

      useSanctumTokenStorage({ get: getTokenMock, set: setTokenMock })

      const app = useNuxtApp()
      const hookSpy = vi.spyOn(app, 'callHook')

      const result = await isUserSessionActive()

      expect(getTokenMock).toHaveBeenCalledWith(app)
      expect(fetchSpy).toHaveBeenCalledWith('/api/user')
      expect(hookSpy).toHaveBeenCalledWith('sanctum:refresh')
      expect(result).toBeTruthy()
    })

    it('does not refresh identity when token is valid', async () => {
      stubConfigMock({
        mode: 'token',
      })

      useSanctumUser().value = USER_RESPONSE

      const
        getTokenMock = vi.fn().mockReturnValue('token-value'),
        setTokenMock = vi.fn()

      useSanctumTokenStorage({ get: getTokenMock, set: setTokenMock })

      const app = useNuxtApp()
      const hookSpy = vi.spyOn(app, 'callHook')

      const result = await isUserSessionActive()

      expect(getTokenMock).toHaveBeenCalledWith(app)
      expect(fetchSpy).not.toHaveBeenCalledWith('/api/user')
      expect(hookSpy).not.toHaveBeenCalledWith('sanctum:refresh')
      expect(result).toBeTruthy()
    })
  })
})
