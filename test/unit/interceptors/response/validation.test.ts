import { beforeEach, describe, expect, it, vi } from 'vitest'
import { validateResponseHeaders } from '../../../../src/runtime/interceptors/response/validation'
import { createMock } from '../../../helpers/mocks'
import { TEST_CONFIG, COMMON_HEADERS } from '../../../helpers/constants'
import type { NuxtApp } from '#app'
import type { ConsolaInstance } from 'consola'
import type { FetchContext } from 'ofetch'

const {
  isServerRuntimeMock,
  useRequestURLMock,
} = vi.hoisted(() => {
  return {
    isServerRuntimeMock: vi.fn(),
    useRequestURLMock: vi.fn(),
  }
})

vi.mock(
  '../../../../src/runtime/utils/runtime',
  () => ({ isServerRuntime: isServerRuntimeMock }),
)

vi.mock(
  '#app',
  () => ({ useRequestURL: useRequestURLMock }),
)

describe('response interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('validateResponseHeaders', () => {
    it('skips validation in CSR mode', async () => {
      isServerRuntimeMock.mockReturnValue(false)

      const mockApp = createMock<NuxtApp>({})
      const mockLogger = createMock<ConsolaInstance>({ debug: vi.fn() })

      const ctx = createMock<FetchContext>({})

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.debug).toHaveBeenCalledWith('[response] skipping headers validation on CSR')
    })

    it('writes warning log on empty headers', async () => {
      isServerRuntimeMock.mockReturnValue(true)

      const mockApp = createMock<NuxtApp>({
        $config: {
          public: {
            sanctum: {},
          },
        },
      })

      const mockLogger = createMock<ConsolaInstance>({ warn: vi.fn() })

      const ctx = createMock<FetchContext>({})

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).toHaveBeenCalledWith('[response] no headers returned from API')
    })

    it('passes validation when all headers are present', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: TEST_CONFIG.CUSTOM_ORIGIN })

      const mockApp = createMock<NuxtApp>({
        $config: {
          public: {
            sanctum: {
              mode: 'token',
            },
          },
        },
      })

      const mockLogger = createMock<ConsolaInstance>({ warn: vi.fn() })

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            [COMMON_HEADERS.SET_COOKIE]: 'header_value',
            [COMMON_HEADERS.CONTENT_TYPE]: 'application/json',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_CREDENTIALS]: 'true',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_ORIGIN]: TEST_CONFIG.CUSTOM_ORIGIN,
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).not.toHaveBeenCalledWith('[response] `set-cookie` header is missing, CSRF token will not be set')
    })

    it('writes warning if cookie header is missing [cookie mode]', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: TEST_CONFIG.CUSTOM_ORIGIN })

      const mockApp = createMock<NuxtApp>({
        $config: {
          public: {
            sanctum: {
              mode: 'cookie',
            },
          },
        },
      })

      const mockLogger = createMock<ConsolaInstance>({ warn: vi.fn() })

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            [COMMON_HEADERS.CONTENT_TYPE]: 'application/json',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_CREDENTIALS]: 'true',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_ORIGIN]: TEST_CONFIG.CUSTOM_ORIGIN,
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).toHaveBeenCalledWith('[response] `set-cookie` header is missing, CSRF token will not be set')
    })

    it('does not validate cookie header [token mode]', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: TEST_CONFIG.CUSTOM_ORIGIN })

      const mockApp = createMock<NuxtApp>({
        $config: {
          public: {
            sanctum: {
              mode: 'token',
            },
          },
        },
      })

      const mockLogger = createMock<ConsolaInstance>({ warn: vi.fn() })

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            [COMMON_HEADERS.CONTENT_TYPE]: 'application/json',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_CREDENTIALS]: 'true',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_ORIGIN]: TEST_CONFIG.CUSTOM_ORIGIN,
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).not.toHaveBeenCalled()
    })

    it('writes warning if content-type header is missing', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: TEST_CONFIG.CUSTOM_ORIGIN })

      const mockApp = createMock<NuxtApp>({
        $config: {
          public: {
            sanctum: {
              mode: 'cookie',
            },
          },
        },
      })

      const mockLogger = createMock<ConsolaInstance>({ warn: vi.fn() })

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            [COMMON_HEADERS.SET_COOKIE]: 'header_value',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_CREDENTIALS]: 'true',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_ORIGIN]: TEST_CONFIG.CUSTOM_ORIGIN,
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).toHaveBeenCalledWith('[response] "content-type" header is missing')
    })

    it('writes debug if content-type header is not JSON', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: TEST_CONFIG.CUSTOM_ORIGIN })

      const mockApp = createMock<NuxtApp>({
        $config: {
          public: {
            sanctum: {
              mode: 'cookie',
            },
          },
        },
      })

      const mockLogger = createMock<ConsolaInstance>({ debug: vi.fn() })

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            [COMMON_HEADERS.SET_COOKIE]: 'header_value',
            [COMMON_HEADERS.CONTENT_TYPE]: 'unknown',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_CREDENTIALS]: 'true',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_ORIGIN]: TEST_CONFIG.CUSTOM_ORIGIN,
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.debug).toHaveBeenCalledWith(`[response] 'content-type' is present in response but different (expected: application/json, got: unknown)`)
    })

    it('writes warning if credentials header is missing [cookie mode]', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: TEST_CONFIG.CUSTOM_ORIGIN })

      const mockApp = createMock<NuxtApp>({
        $config: {
          public: {
            sanctum: {
              mode: 'cookie',
            },
          },
        },
      })

      const mockLogger = createMock<ConsolaInstance>({ warn: vi.fn() })

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            [COMMON_HEADERS.SET_COOKIE]: 'header_value',
            [COMMON_HEADERS.CONTENT_TYPE]: 'application/json',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_ORIGIN]: TEST_CONFIG.CUSTOM_ORIGIN,
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).toHaveBeenCalledWith(`[response] 'access-control-allow-credentials' header is missing or invalid (expected: true, got: null)`)
    })

    it('writes warning if credentials header is disabled [cookie mode]', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: TEST_CONFIG.CUSTOM_ORIGIN })

      const mockApp = createMock<NuxtApp>({
        $config: {
          public: {
            sanctum: {
              mode: 'cookie',
            },
          },
        },
      })

      const mockLogger = createMock<ConsolaInstance>({ warn: vi.fn() })

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            [COMMON_HEADERS.SET_COOKIE]: 'header_value',
            [COMMON_HEADERS.CONTENT_TYPE]: 'application/json',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_CREDENTIALS]: 'false',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_ORIGIN]: TEST_CONFIG.CUSTOM_ORIGIN,
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).toHaveBeenCalledWith(`[response] 'access-control-allow-credentials' header is missing or invalid (expected: true, got: false)`)
    })

    it('skips validation of credentials header [token mode]', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: TEST_CONFIG.CUSTOM_ORIGIN })

      const mockApp = createMock<NuxtApp>({
        $config: {
          public: {
            sanctum: {
              mode: 'token',
            },
          },
        },
      })

      const mockLogger = createMock<ConsolaInstance>({ warn: vi.fn() })

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            [COMMON_HEADERS.SET_COOKIE]: 'header_value',
            [COMMON_HEADERS.CONTENT_TYPE]: 'application/json',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_ORIGIN]: TEST_CONFIG.CUSTOM_ORIGIN,
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).not.toHaveBeenCalled()
    })

    it('writes warning if origin header is missing', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: TEST_CONFIG.CUSTOM_ORIGIN })

      const mockApp = createMock<NuxtApp>({
        $config: {
          public: {
            sanctum: {
              mode: 'cookie',
            },
          },
        },
      })

      const mockLogger = createMock<ConsolaInstance>({ warn: vi.fn() })

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            [COMMON_HEADERS.SET_COOKIE]: 'header_value',
            [COMMON_HEADERS.CONTENT_TYPE]: 'application/json',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_CREDENTIALS]: 'true',
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).toHaveBeenCalledWith(`[response] 'access-control-allow-origin' header is missing or invalid (expected: ${TEST_CONFIG.CUSTOM_ORIGIN}, got: null)`)
    })

    it('writes warning if origin header does not include request origin', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: TEST_CONFIG.CUSTOM_ORIGIN })

      const mockApp = createMock<NuxtApp>({
        $config: {
          public: {
            sanctum: {
              mode: 'cookie',
            },
          },
        },
      })

      const mockLogger = createMock<ConsolaInstance>({ warn: vi.fn() })

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            [COMMON_HEADERS.SET_COOKIE]: 'header_value',
            [COMMON_HEADERS.CONTENT_TYPE]: 'application/json',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_CREDENTIALS]: 'true',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_ORIGIN]: 'http://another-host.dev',
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).toHaveBeenCalledWith(`[response] 'access-control-allow-origin' header is missing or invalid (expected: ${TEST_CONFIG.CUSTOM_ORIGIN}, got: http://another-host.dev)`)
    })

    it('writes warning if origin header does not include origin from config', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: TEST_CONFIG.CUSTOM_ORIGIN })

      const mockApp = createMock<NuxtApp>({
        $config: {
          public: {
            sanctum: {
              mode: 'cookie',
              origin: 'http://sanctum-host.dev',
            },
          },
        },
      })

      const mockLogger = createMock<ConsolaInstance>({ warn: vi.fn() })

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            [COMMON_HEADERS.SET_COOKIE]: 'header_value',
            [COMMON_HEADERS.CONTENT_TYPE]: 'application/json',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_CREDENTIALS]: 'true',
            [COMMON_HEADERS.ACCESS_CONTROL_ALLOW_ORIGIN]: 'http://another-host.dev',
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).toHaveBeenCalledWith(`[response] 'access-control-allow-origin' header is missing or invalid (expected: http://sanctum-host.dev, got: http://another-host.dev)`)
    })
  })
})
