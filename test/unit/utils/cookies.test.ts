import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createCookiesMap,
  extractCookiesFromEventHeaders,
  extractCookiesFromHeaders,
  initCsrfCookie,
  writeCookiesToEvent,
} from '../../../src/runtime/utils/cookies'
import { createLoggerMock, createMock } from '../../helpers/mocks'
import type { PublicModuleOptions } from '../../../src/runtime/types/options'
import type { H3Event, EventHandlerRequest } from 'h3'

const { fetchMock } = vi.hoisted(() => {
  return {
    fetchMock: vi.fn(),
  }
})

vi.stubGlobal('$fetch', fetchMock)

describe('cookies utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initCsrfCookie', () => {
    it('requests a new CSRF cookie from the API', async () => {
      const config = createMock<PublicModuleOptions>({
        baseUrl: 'http://remote-host.dev',
        endpoints: {
          csrf: '/api/token',
        },
      })
      const mockLogger = createLoggerMock()

      await initCsrfCookie(config, mockLogger)

      expect(fetchMock).toHaveBeenCalledWith('/api/token', {
        baseURL: 'http://remote-host.dev',
        credentials: 'include',
      })
      expect(mockLogger.debug).toHaveBeenCalledWith('[request] CSRF cookie has been initialized')
    })

    it('throws error if csrf endpoint is undefined', async () => {
      const config = createMock<PublicModuleOptions>({
        endpoints: {
          csrf: undefined,
        },
      })
      const mockLogger = createLoggerMock()

      await expect(initCsrfCookie(config, mockLogger))
        .rejects
        .toThrow('`sanctum.endpoints.csrf` is not defined')

      expect(fetchMock).not.toHaveBeenCalled()
    })
  })

  describe('extractCookiesFromHeaders', () => {
    it('extracts cookies from the response headers', () => {
      const headers = new Headers({
        'set-cookie': 'cookie-name=value-one',
      })

      expect(extractCookiesFromHeaders(headers)).toStrictEqual([
        'cookie-name=value-one',
      ])
    })

    it('returns an empty array when no cookies are returned', () => {
      expect(extractCookiesFromHeaders(new Headers({}))).toStrictEqual([])
      expect(extractCookiesFromHeaders(undefined)).toStrictEqual([])
    })
  })

  describe('extractCookiesFromEventHeaders', () => {
    it('extracts cookies from an array header value', () => {
      expect(extractCookiesFromEventHeaders({
        'set-cookie': [
          'cookie-name=value-one',
          'cookie-name-2=value-two',
        ],
      })).toStrictEqual([
        'cookie-name=value-one',
        'cookie-name-2=value-two',
      ])
    })

    it('extracts cookies from a string header value', () => {
      expect(extractCookiesFromEventHeaders({
        'set-cookie': 'cookie-name=value-one',
      })).toStrictEqual([
        'cookie-name=value-one',
      ])
    })

    it('returns an empty array when the header is missing', () => {
      expect(extractCookiesFromEventHeaders({})).toStrictEqual([])
    })
  })

  describe('createCookiesMap', () => {
    it('deduplicates cookies by name', () => {
      const map = createCookiesMap(
        ['cookie-name=value-one'],
        ['cookie-name=value-two', 'other-cookie=value'],
      )

      expect(Array.from(map.values())).toStrictEqual([
        'cookie-name=value-two',
        'other-cookie=value',
      ])
    })
  })

  describe('writeCookiesToEvent', () => {
    it('writes cookies to the event response headers', () => {
      const setHeader = vi.fn()

      const mockEvent = createMock<H3Event<EventHandlerRequest>>({
        handled: false,
        node: {
          res: {
            setHeader,
          },
        },
      })

      const cookiesMap = createCookiesMap(['cookie-name=value-one'])

      const applied = writeCookiesToEvent(mockEvent, cookiesMap)

      expect(applied).toBe(true)
      expect(setHeader).toHaveBeenCalledWith('set-cookie', ['cookie-name=value-one'])
    })

    it('does not write cookies when the response is already handled', () => {
      const setHeader = vi.fn()

      const mockEvent = createMock<H3Event<EventHandlerRequest>>({
        handled: true,
        node: {
          res: {
            setHeader,
          },
        },
      })

      const cookiesMap = createCookiesMap(['cookie-name=value-one'])

      const applied = writeCookiesToEvent(mockEvent, cookiesMap)

      expect(applied).toBe(false)
      expect(setHeader).not.toHaveBeenCalled()
    })

    it('does not write cookies when the response headers are already sent', () => {
      const setHeader = vi.fn()

      const mockEvent = createMock<H3Event<EventHandlerRequest>>({
        handled: false,
        node: {
          res: {
            headersSent: true,
            setHeader,
          },
        },
      })

      const cookiesMap = createCookiesMap(['cookie-name=value-one'])

      const applied = writeCookiesToEvent(mockEvent, cookiesMap)

      expect(applied).toBe(false)
      expect(setHeader).not.toHaveBeenCalled()
    })

    it('returns false when setHeader throws an error', () => {
      const setHeader = vi.fn().mockImplementation(() => {
        throw new Error('ERR_HTTP_HEADERS_SENT')
      })

      const mockEvent = createMock<H3Event<EventHandlerRequest>>({
        handled: false,
        node: {
          res: {
            headersSent: false,
            setHeader,
          },
        },
      })

      const cookiesMap = createCookiesMap(['cookie-name=value-one'])

      const applied = writeCookiesToEvent(mockEvent, cookiesMap)

      expect(applied).toBe(false)
      expect(setHeader).toHaveBeenCalledWith('set-cookie', ['cookie-name=value-one'])
    })
  })
})
