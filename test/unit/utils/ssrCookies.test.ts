import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  applyPendingCookies,
  ensureSsrCsrfCookie,
  replayPendingCookies,
} from '../../../src/runtime/utils/ssrCookies'
import { createLoggerMock, createMock } from '../../helpers/mocks'
import { PENDING_COOKIES_STATE_KEY } from '../../../src/runtime/utils/constants'
import type { PublicModuleOptions } from '../../../src/runtime/types/options'
import type { H3Event, EventHandlerRequest } from 'h3'

const {
  useRequestEventMock,
  useRequestHeadersMock,
  useStateMock,
  fetchRawMock,
} = vi.hoisted(() => {
  return {
    useRequestEventMock: vi.fn(),
    useRequestHeadersMock: vi.fn(),
    useStateMock: vi.fn(),
    fetchRawMock: vi.fn(),
  }
})

vi.mock(
  '#app',
  () => ({
    useRequestEvent: useRequestEventMock,
    useRequestHeaders: useRequestHeadersMock,
    useState: useStateMock,
  }),
)

const fetchMock = vi.fn()

vi.stubGlobal('$fetch', Object.assign(fetchMock, { raw: fetchRawMock }))

const cookieConfig = createMock<PublicModuleOptions>({
  mode: 'cookie',
  baseUrl: 'http://remote-host.dev',
  csrf: {
    cookie: 'XSRF-TOKEN',
    header: 'X-XSRF-TOKEN',
  },
  endpoints: {
    csrf: '/api/csrf',
  },
})

function createMockEvent(headers: Record<string, string> = {}): H3Event<EventHandlerRequest> {
  return createMock<H3Event<EventHandlerRequest>>({
    handled: false,
    node: {
      res: {
        getHeaders: vi.fn().mockReturnValue(headers),
        setHeader: vi.fn(),
      },
    },
  })
}

describe('SSR cookies utils', () => {
  afterAll(() => {
    vi.unstubAllGlobals()
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('ensureSsrCsrfCookie', () => {
    it('no-op when token mode is enabled', async () => {
      const mockLogger = createLoggerMock()

      await ensureSsrCsrfCookie({ ...cookieConfig, mode: 'token' }, mockLogger)

      expect(useRequestHeadersMock).not.toHaveBeenCalled()
      expect(useRequestEventMock).not.toHaveBeenCalled()
      expect(fetchRawMock).not.toHaveBeenCalled()
    })

    it('no-op when csrf endpoint is not defined', async () => {
      const mockLogger = createLoggerMock()

      await ensureSsrCsrfCookie({ ...cookieConfig, endpoints: {} }, mockLogger)

      expect(useRequestHeadersMock).not.toHaveBeenCalled()
      expect(useRequestEventMock).not.toHaveBeenCalled()
      expect(fetchRawMock).not.toHaveBeenCalled()
    })

    it('no-op when csrf cookie name is not defined', async () => {
      const mockLogger = createLoggerMock()

      await ensureSsrCsrfCookie({ ...cookieConfig, csrf: {} }, mockLogger)

      expect(useRequestHeadersMock).not.toHaveBeenCalled()
      expect(useRequestEventMock).not.toHaveBeenCalled()
      expect(fetchRawMock).not.toHaveBeenCalled()
    })

    it('no-op when the CSRF cookie is already forwarded by the browser', async () => {
      useRequestHeadersMock.mockReturnValue({
        cookie: 'laravel_session=abc; XSRF-TOKEN=token-value',
      })

      const mockLogger = createLoggerMock()

      await ensureSsrCsrfCookie(cookieConfig, mockLogger)

      expect(useRequestEventMock).not.toHaveBeenCalled()
      expect(fetchRawMock).not.toHaveBeenCalled()
    })

    it('fetches and forwards the CSRF cookie before rendering', async () => {
      useRequestHeadersMock.mockReturnValue({
        'cookie': 'laravel_session=abc',
        'user-agent': 'Mozilla/5.0',
      })

      const mockEvent = createMockEvent({
        'set-cookie': 'event-cookie=value-one',
      })

      useRequestEventMock.mockReturnValue(mockEvent)
      fetchRawMock.mockResolvedValue({
        headers: new Headers({
          'set-cookie': 'XSRF-TOKEN=fresh-token',
        }),
      })

      const mockLogger = createLoggerMock()

      await ensureSsrCsrfCookie(cookieConfig, mockLogger)

      expect(fetchRawMock).toHaveBeenCalledWith('/api/csrf', {
        baseURL: 'http://remote-host.dev',
        credentials: 'include',
        headers: {
          'cookie': 'laravel_session=abc',
          'user-agent': 'Mozilla/5.0',
        },
      })
      expect(mockEvent.node.res.setHeader).toHaveBeenCalledWith(
        'set-cookie',
        [
          'event-cookie=value-one',
          'XSRF-TOKEN=fresh-token',
        ],
      )
      expect(mockLogger.debug).toHaveBeenCalledWith('[ssr] CSRF cookie has been initialized before rendering')
      expect(mockLogger.warn).not.toHaveBeenCalled()
    })

    it('does not throw when the API request fails', async () => {
      useRequestHeadersMock.mockReturnValue({
        cookie: undefined,
      })
      useRequestEventMock.mockReturnValue(createMockEvent())
      fetchRawMock.mockRejectedValue(new Error('network error'))

      const mockLogger = createLoggerMock()

      await ensureSsrCsrfCookie(cookieConfig, mockLogger)

      expect(mockLogger.warn).toHaveBeenCalledWith(
        '[ssr] unable to initialize CSRF cookie before rendering',
        { reason: expect.any(Error) },
      )
    })
  })

  describe('applyPendingCookies', () => {
    beforeEach(() => {
      vi.stubGlobal('document', { cookie: '' })
    })

    it('no-op when token mode is enabled', () => {
      expect(applyPendingCookies({ ...cookieConfig, mode: 'token' })).toBe(false)
      expect(useStateMock).not.toHaveBeenCalled()
    })

    it('no-op when there are no pending cookies', () => {
      useStateMock.mockReturnValue({ value: [] })

      expect(applyPendingCookies(cookieConfig)).toBe(false)
      expect(document.cookie).toBe('')
    })

    it('writes non-HttpOnly cookies and clears the state', () => {
      const pendingState = { value: [
        'XSRF-TOKEN=token-value; Path=/; SameSite=lax',
        'custom_cookie=val; httponly_flag=false',
      ] }

      useStateMock.mockReturnValue(pendingState)

      expect(applyPendingCookies(cookieConfig)).toBe(false)
      expect(document.cookie).toBe('custom_cookie=val; httponly_flag=false')
      expect(pendingState.value).toStrictEqual([])
    })

    it('skips HttpOnly cookies and reports the need for a session refresh', () => {
      const pendingState = { value: [
        'XSRF-TOKEN=token-value; Path=/; SameSite=lax',
        'laravel_session=abc; HttpOnly; Path=/',
      ] }

      useStateMock.mockReturnValue(pendingState)

      expect(applyPendingCookies(cookieConfig)).toBe(true)
      expect(document.cookie).toBe('XSRF-TOKEN=token-value; Path=/; SameSite=lax')
      expect(pendingState.value).toStrictEqual([])
    })

    it('reads the pending cookies state', () => {
      useStateMock.mockReturnValue({ value: [] })

      applyPendingCookies(cookieConfig)

      expect(useStateMock).toHaveBeenCalledWith(PENDING_COOKIES_STATE_KEY, expect.any(Function))
    })
  })

  describe('replayPendingCookies', () => {
    it('no-op when csrf endpoint is not defined', async () => {
      const mockLogger = createLoggerMock()

      await replayPendingCookies({ ...cookieConfig, endpoints: {} }, mockLogger)

      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('requests a fresh CSRF cookie to re-establish the session', async () => {
      const mockLogger = createLoggerMock()

      await replayPendingCookies(cookieConfig, mockLogger)

      expect(fetchMock).toHaveBeenCalledWith('/api/csrf', {
        baseURL: 'http://remote-host.dev',
        credentials: 'include',
      })
      expect(mockLogger.debug).toHaveBeenCalledWith('[request] CSRF cookie has been initialized')
    })
  })
})
