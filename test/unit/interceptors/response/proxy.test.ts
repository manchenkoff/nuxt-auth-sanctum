import { beforeEach, describe, expect, it, vi } from 'vitest'
import { proxyResponseHeaders } from '../../../../src/runtime/interceptors/response/proxy'
import { createAppMock, createLoggerMock, createMock } from '../../../helpers/mocks'
import type { FetchContext } from 'ofetch'
import type { H3Event, EventHandlerRequest } from 'h3'

const {
  useSanctumConfigMock,
  useRequestEventMock,
  navigateToMock,
  isServerRuntimeMock,
} = vi.hoisted(() => {
  return {
    useSanctumConfigMock: vi.fn(),
    useRequestEventMock: vi.fn(),
    navigateToMock: vi.fn(),
    isServerRuntimeMock: vi.fn(),
  }
})

vi.mock(
  '../../../../src/runtime/composables/useSanctumConfig',
  () => ({ useSanctumConfig: useSanctumConfigMock }),
)

vi.mock(
  '../../../../src/runtime/utils/runtime',
  () => ({ isServerRuntime: isServerRuntimeMock.mockReturnValue(true) }),
)

vi.mock(
  '#app',
  () => ({
    useRequestEvent: useRequestEventMock,
    navigateTo: navigateToMock,
  }),
)

describe('response interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('proxyResponseHeaders', () => {
    it('no-op when token mode enabled', async () => {
      useSanctumConfigMock.mockReturnValue({ mode: 'token' })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({})

      await proxyResponseHeaders(mockApp, ctx, mockLogger)

      expect(isServerRuntimeMock).not.toHaveBeenCalled()
      expect(useRequestEventMock).not.toHaveBeenCalled()
      expect(navigateToMock).not.toHaveBeenCalled()
    })

    it('writes warning on empty response', async () => {
      useSanctumConfigMock.mockReturnValue({ mode: 'cookie' })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({})

      await proxyResponseHeaders(mockApp, ctx, mockLogger)

      expect(isServerRuntimeMock).not.toHaveBeenCalled()
      expect(useRequestEventMock).not.toHaveBeenCalled()
      expect(navigateToMock).not.toHaveBeenCalled()
      expect(mockLogger.debug).toHaveBeenCalledWith('[response] no response to process')
    })

    it('follows redirects from response', async () => {
      useSanctumConfigMock.mockReturnValue({ mode: 'cookie' })
      isServerRuntimeMock.mockReturnValue(false)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const redirectUrl = 'http://redirect.dev'

      const ctx = createMock<FetchContext>({
        response: {
          redirected: true,
          url: redirectUrl,
        },
      })

      await proxyResponseHeaders(mockApp, ctx, mockLogger)

      expect(isServerRuntimeMock).toHaveBeenCalled()
      expect(useRequestEventMock).not.toHaveBeenCalled()
      expect(navigateToMock).toHaveBeenCalledWith(redirectUrl)
      expect(mockApp.callHook).toHaveBeenCalledWith('sanctum:redirect', redirectUrl)
      expect(mockApp.runWithContext).toHaveBeenCalled()
      expect(mockLogger.debug).not.toHaveBeenCalled()
    })

    it('appends headers in SSR mode', async () => {
      useSanctumConfigMock.mockReturnValue({ mode: 'cookie' })
      isServerRuntimeMock.mockReturnValue(true)

      const mockEvent = createMock<H3Event<EventHandlerRequest>>({
        node: {
          res: {
            getHeaders: vi
              .fn()
              .mockReturnValue({
                'set-cookie': 'event-cookie-name=value-one',
              }),
            setHeader: vi.fn(),
          },
        },
      })

      useRequestEventMock.mockReturnValue(mockEvent)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            'set-cookie': 'response-cookie-name=value-two',
          }),
        },
      })

      await proxyResponseHeaders(mockApp, ctx, mockLogger)

      expect(isServerRuntimeMock).toHaveBeenCalled()
      expect(useRequestEventMock).toHaveBeenCalledWith(mockApp)
      expect(navigateToMock).not.toHaveBeenCalled()
      expect(mockApp.callHook).not.toHaveBeenCalledWith()
      expect(mockApp.runWithContext).not.toHaveBeenCalled()
      expect(mockLogger.debug).toHaveBeenCalledWith(
        '[response] pass cookies from server to client response',
        [
          'event-cookie-name',
          'response-cookie-name',
        ],
      )
      expect(mockEvent.node.res.setHeader).toHaveBeenCalledWith(
        'set-cookie',
        [
          'event-cookie-name=value-one',
          'response-cookie-name=value-two',
        ],
      )
    })

    it('writes warning when request event is not defined', async () => {
      useSanctumConfigMock.mockReturnValue({ mode: 'cookie' })
      isServerRuntimeMock.mockReturnValue(true)

      useRequestEventMock.mockReturnValue(undefined)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        request: 'http://requested-url.dev',
        response: {},
      })

      await proxyResponseHeaders(mockApp, ctx, mockLogger)

      expect(isServerRuntimeMock).toHaveBeenCalled()
      expect(useRequestEventMock).toHaveBeenCalledWith(mockApp)
      expect(navigateToMock).not.toHaveBeenCalled()
      expect(mockApp.callHook).not.toHaveBeenCalledWith()
      expect(mockApp.runWithContext).not.toHaveBeenCalled()
      expect(mockLogger.debug).toHaveBeenCalledWith(`[response] no event to pass cookies to the client [${ctx.request}]`)
    })

    it('writes debug when no cookies returned from API', async () => {
      useSanctumConfigMock.mockReturnValue({ mode: 'cookie' })
      isServerRuntimeMock.mockReturnValue(true)

      const mockEvent = createMock<H3Event<EventHandlerRequest>>({
        node: {
          res: {
            getHeaders: vi
              .fn()
              .mockReturnValue({
                'set-cookie': 'event-cookie-name=value-one',
              }),
            setHeader: vi.fn(),
          },
        },
      })

      useRequestEventMock.mockReturnValue(mockEvent)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        request: 'http://requested-url.dev',
        response: {
          headers: new Headers({}),
        },
      })

      await proxyResponseHeaders(mockApp, ctx, mockLogger)

      expect(isServerRuntimeMock).toHaveBeenCalled()
      expect(useRequestEventMock).toHaveBeenCalledWith(mockApp)
      expect(navigateToMock).not.toHaveBeenCalled()
      expect(mockApp.callHook).not.toHaveBeenCalledWith()
      expect(mockApp.runWithContext).not.toHaveBeenCalled()
      expect(mockLogger.debug).toHaveBeenCalledWith(`[response] no cookies to pass to the client [${ctx.request}]`)
      expect(mockLogger.debug).toHaveBeenCalledWith(
        '[response] pass cookies from server to client response',
        [
          'event-cookie-name',
        ],
      )
      expect(mockEvent.node.res.setHeader).toHaveBeenCalledWith(
        'set-cookie',
        [
          'event-cookie-name=value-one',
        ],
      )
    })

    it('deduplicates cookies in the response', async () => {
      useSanctumConfigMock.mockReturnValue({ mode: 'cookie' })
      isServerRuntimeMock.mockReturnValue(true)

      const mockEvent = createMock<H3Event<EventHandlerRequest>>({
        node: {
          res: {
            getHeaders: vi
              .fn()
              .mockReturnValue({
                'set-cookie': 'unique-cookie-name=value-one',
              }),
            setHeader: vi.fn(),
          },
        },
      })

      useRequestEventMock.mockReturnValue(mockEvent)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            'set-cookie': 'unique-cookie-name=value-two',
          }),
        },
      })

      await proxyResponseHeaders(mockApp, ctx, mockLogger)

      expect(isServerRuntimeMock).toHaveBeenCalled()
      expect(useRequestEventMock).toHaveBeenCalledWith(mockApp)
      expect(navigateToMock).not.toHaveBeenCalled()
      expect(mockApp.callHook).not.toHaveBeenCalledWith()
      expect(mockApp.runWithContext).not.toHaveBeenCalled()
      expect(mockLogger.debug).toHaveBeenCalledWith(
        '[response] pass cookies from server to client response',
        [
          'unique-cookie-name',
        ],
      )
      expect(mockEvent.node.res.setHeader).toHaveBeenCalledWith(
        'set-cookie',
        [
          'unique-cookie-name=value-two',
        ],
      )
    })
  })
})
