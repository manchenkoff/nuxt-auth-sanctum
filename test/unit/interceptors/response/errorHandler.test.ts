import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleResponseError } from '../../../../src/runtime/interceptors/response/errorHandler'
import { createAppMock, createLoggerMock, createMock } from '../../../helpers/mocks'
import type { FetchContext } from 'ofetch'

const {
  useSanctumConfigMock,
  useSanctumUserMock,
  navigateToMock,
  isServerRuntimeMock,
  useRouterMock,
} = vi.hoisted(() => {
  return {
    useSanctumConfigMock: vi.fn(),
    useSanctumUserMock: vi.fn(),
    navigateToMock: vi.fn(),
    isServerRuntimeMock: vi.fn(),
    useRouterMock: vi.fn(),
  }
})

vi.mock(
  '../../../../src/runtime/composables/useSanctumConfig',
  () => ({ useSanctumConfig: useSanctumConfigMock }),
)

vi.mock(
  '../../../../src/runtime/composables/useSanctumUser',
  () => ({ useSanctumUser: useSanctumUserMock }),
)

vi.mock(
  '../../../../src/runtime/utils/runtime',
  () => ({ isServerRuntime: isServerRuntimeMock.mockReturnValue(true) }),
)

vi.mock('#app', () => ({
  navigateTo: navigateToMock,
  useRouter: useRouterMock,
}))

describe('response interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('handleResponseError', () => {
    it('writes warning on 419 response', async () => {
      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()
      const ctx = createMock<FetchContext>({ response: { status: 419 } })

      await handleResponseError(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).toHaveBeenCalledWith('CSRF token mismatch, check your API configuration')
    })

    it('resets identity on 401 response', async () => {
      const mockUser = { value: { id: 1, name: 'John' } }

      useSanctumUserMock.mockReturnValue(mockUser)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()
      const ctx = createMock<FetchContext>({ response: { status: 401 } })

      await handleResponseError(mockApp, ctx, mockLogger)

      expect(mockUser.value).toBeNull()
      expect(mockLogger.warn).toHaveBeenCalledWith('User session is not set in API or expired, resetting identity')
    })

    it('no-op on 401 response if not authenticated', async () => {
      const mockUser = { value: null }

      useSanctumUserMock.mockReturnValue(mockUser)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()
      const ctx = createMock<FetchContext>({ response: { status: 401 } })

      await handleResponseError(mockApp, ctx, mockLogger)

      expect(mockUser.value).toBeNull()
      expect(mockLogger.warn).not.toHaveBeenCalled()
    })

    it('redirects on client for 401 with redirect enabled', async () => {
      useSanctumConfigMock.mockReturnValue({
        redirectIfUnauthenticated: true,
        redirect: { onAuthOnly: '/login' },
      })

      useSanctumUserMock.mockReturnValue({ value: { id: 1 } })

      const routerResolveMock = vi.fn().mockReturnValue({ fullPath: '/login' })

      useRouterMock.mockReturnValue({ resolve: routerResolveMock })

      isServerRuntimeMock.mockReturnValue(false)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()
      const ctx = createMock<FetchContext>({ response: { status: 401 } })

      await handleResponseError(mockApp, ctx, mockLogger)

      expect(mockApp.callHook).toHaveBeenCalledWith('sanctum:redirect', '/login')
      expect(navigateToMock).toHaveBeenCalledWith({ path: '/login' })
    })

    it('redirects on client for 401 with redirect enabled [keeps currentRoute]', async () => {
      useSanctumConfigMock.mockReturnValue({
        redirectIfUnauthenticated: true,
        redirect: { onAuthOnly: '/login', keepRouteOnUnauthenticated: true },
      })

      useSanctumUserMock.mockReturnValue({ value: { id: 1 } })

      const routerResolveMock = vi.fn().mockReturnValue({ fullPath: '/login?redirect=/home' })

      useRouterMock.mockReturnValue({
        resolve: routerResolveMock,
        currentRoute: { value: { fullPath: '/home' } },
      })

      isServerRuntimeMock.mockReturnValue(false)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()
      const ctx = createMock<FetchContext>({ response: { status: 401 } })

      await handleResponseError(mockApp, ctx, mockLogger)

      expect(mockApp.callHook).toHaveBeenCalledWith('sanctum:redirect', '/login?redirect=/home')
      expect(navigateToMock).toHaveBeenCalledWith({
        path: '/login',
        query: { redirect: '/home' },
      })
    })

    it('redirects on client for 401 [keepRouteOnUnauthenticated with root path]', async () => {
      useSanctumConfigMock.mockReturnValue({
        redirectIfUnauthenticated: true,
        redirect: { onAuthOnly: '/login', keepRouteOnUnauthenticated: true },
      })

      useSanctumUserMock.mockReturnValue({ value: { id: 1 } })

      const routerResolveMock = vi.fn().mockReturnValue({ fullPath: '/login?redirect=/' })

      useRouterMock.mockReturnValue({
        resolve: routerResolveMock,
        currentRoute: { value: { fullPath: '/' } },
      })

      isServerRuntimeMock.mockReturnValue(false)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()
      const ctx = createMock<FetchContext>({ response: { status: 401 } })

      await handleResponseError(mockApp, ctx, mockLogger)

      expect(mockApp.callHook).toHaveBeenCalledWith('sanctum:redirect', '/login?redirect=/')
      expect(navigateToMock).toHaveBeenCalledWith({
        path: '/login',
        query: { redirect: '/' },
      })
    })

    it('redirects on client for 401 [keepRouteOnUnauthenticated trims trailing slash]', async () => {
      useSanctumConfigMock.mockReturnValue({
        redirectIfUnauthenticated: true,
        redirect: { onAuthOnly: '/login', keepRouteOnUnauthenticated: true },
      })

      useSanctumUserMock.mockReturnValue({ value: { id: 1 } })

      const routerResolveMock = vi.fn().mockReturnValue({ fullPath: '/login?redirect=/dashboard' })

      useRouterMock.mockReturnValue({
        resolve: routerResolveMock,
        currentRoute: { value: { fullPath: '/dashboard/' } },
      })

      isServerRuntimeMock.mockReturnValue(false)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()
      const ctx = createMock<FetchContext>({ response: { status: 401 } })

      await handleResponseError(mockApp, ctx, mockLogger)

      expect(mockApp.callHook).toHaveBeenCalledWith('sanctum:redirect', '/login?redirect=/dashboard')
      expect(navigateToMock).toHaveBeenCalledWith({
        path: '/login',
        query: { redirect: '/dashboard' },
      })
    })

    it('skips redirect on server for 401', async () => {
      useSanctumConfigMock.mockReturnValue({
        redirectIfUnauthenticated: true,
        redirect: { onAuthOnly: '/login' },
      })

      useSanctumUserMock.mockReturnValue({ value: { id: 1 } })

      isServerRuntimeMock.mockReturnValue(true)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({ response: { status: 401 } })

      await handleResponseError(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).toHaveBeenCalledWith('User session is not set in API or expired, resetting identity')
      expect(mockApp.callHook).not.toHaveBeenCalled()
      expect(navigateToMock).not.toHaveBeenCalled()
    })

    it('no action for other status codes', async () => {
      const mockUser = { value: { id: 1 } }

      useSanctumUserMock.mockReturnValue(mockUser)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({ response: { status: 500 } })

      await handleResponseError(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).not.toHaveBeenCalled()
      expect(mockUser.value).not.toBeNull()
    })
  })
})
