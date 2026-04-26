import { beforeEach, describe, expect, it, vi } from 'vitest'
import { validateResponseHeaders } from '../../../../src/runtime/interceptors/response/validation'
import { createAppMock, createLoggerMock, createMock } from '../../../helpers/mocks'
import type { FetchContext } from 'ofetch'

const {
  isServerRuntimeMock,
  useRequestURLMock,
  useRuntimeConfigMock,
} = vi.hoisted(() => {
  return {
    isServerRuntimeMock: vi.fn(),
    useRequestURLMock: vi.fn(),
    useRuntimeConfigMock: vi.fn(),
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

vi.mock(
  '#imports',
  () => ({ useRuntimeConfig: useRuntimeConfigMock }),
)

describe('response interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('validateResponseHeaders', () => {
    it('skips validation in CSR mode', async () => {
      isServerRuntimeMock.mockReturnValue(false)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({})

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.debug).toHaveBeenCalledWith('[response] skipping headers validation on CSR')
    })

    it('writes warning log on empty headers', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRuntimeConfigMock.mockReturnValue({
        sanctum: {},
      })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({})

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).toHaveBeenCalledWith('[response] no headers returned from API')
    })

    it('passes validation when all headers are present', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: 'http://custom-origin.dev' })
      useRuntimeConfigMock.mockReturnValue({
        sanctum: {
          mode: 'cookie',
        },
      })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            ['set-cookie']: 'header_value',
            ['content-type']: 'application/json',
            ['access-control-allow-credentials']: 'true',
            ['access-control-allow-origin']: 'http://custom-origin.dev',
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).not.toHaveBeenCalledWith('[response] `set-cookie` header is missing, CSRF token will not be set')
    })

    it('writes warning if cookie header is missing [cookie mode]', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: 'http://custom-origin.dev' })
      useRuntimeConfigMock.mockReturnValue({
        sanctum: {
          mode: 'cookie',
        },
      })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            ['content-type']: 'application/json',
            ['access-control-allow-credentials']: 'true',
            ['access-control-allow-origin']: 'http://custom-origin.dev',
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).toHaveBeenCalledWith('[response] `set-cookie` header is missing, CSRF token will not be set')
    })

    it('does not validate cookie header [token mode]', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: 'http://custom-origin.dev' })
      useRuntimeConfigMock.mockReturnValue({
        sanctum: {
          mode: 'token',
        },
      })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            ['content-type']: 'application/json',
            ['access-control-allow-credentials']: 'true',
            ['access-control-allow-origin']: 'http://custom-origin.dev',
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).not.toHaveBeenCalled()
    })

    it('writes warning if content-type header is missing', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: 'http://custom-origin.dev' })
      useRuntimeConfigMock.mockReturnValue({
        sanctum: {
          mode: 'cookie',
        },
      })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            ['set-cookie']: 'header_value',
            ['access-control-allow-credentials']: 'true',
            ['access-control-allow-origin']: 'http://custom-origin.dev',
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.warn).toHaveBeenCalledWith('[response] "content-type" header is missing')
    })

    it('writes debug if content-type header is not JSON', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: 'http://custom-origin.dev' })
      useRuntimeConfigMock.mockReturnValue({
        sanctum: {
          mode: 'cookie',
        },
      })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            ['set-cookie']: 'header_value',
            ['content-type']: 'unknown',
            ['access-control-allow-credentials']: 'true',
            ['access-control-allow-origin']: 'http://custom-origin.dev',
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(useRuntimeConfigMock).toHaveBeenCalled()
      expect(mockLogger.debug).toHaveBeenCalledWith(`[response] 'content-type' is present in response but different (expected: application/json, got: unknown)`)
    })

    it('writes warning if credentials header is missing [cookie mode]', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: 'http://custom-origin.dev' })
      useRuntimeConfigMock.mockReturnValue({
        sanctum: {
          mode: 'cookie',
        },
      })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            ['set-cookie']: 'header_value',
            ['content-type']: 'application/json',
            ['access-control-allow-origin']: 'http://custom-origin.dev',
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(useRuntimeConfigMock).toHaveBeenCalled()
      expect(mockLogger.warn).toHaveBeenCalledWith(`[response] 'access-control-allow-credentials' header is missing or invalid (expected: true, got: null)`)
    })

    it('writes warning if credentials header is disabled [cookie mode]', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: 'http://custom-origin.dev' })
      useRuntimeConfigMock.mockReturnValue({
        sanctum: {
          mode: 'cookie',
        },
      })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            ['set-cookie']: 'header_value',
            ['content-type']: 'application/json',
            ['access-control-allow-credentials']: 'false',
            ['access-control-allow-origin']: 'http://custom-origin.dev',
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(useRuntimeConfigMock).toHaveBeenCalled()
      expect(mockLogger.warn).toHaveBeenCalledWith(`[response] 'access-control-allow-credentials' header is missing or invalid (expected: true, got: false)`)
    })

    it('skips validation of credentials header [token mode]', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: 'http://custom-origin.dev' })
      useRuntimeConfigMock.mockReturnValue({
        sanctum: {
          mode: 'token',
        },
      })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            ['set-cookie']: 'header_value',
            ['content-type']: 'application/json',
            ['access-control-allow-origin']: 'http://custom-origin.dev',
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(useRuntimeConfigMock).toHaveBeenCalled()
      expect(mockLogger.warn).not.toHaveBeenCalled()
    })

    it('writes warning if origin header is missing', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: 'http://custom-origin.dev' })
      useRuntimeConfigMock.mockReturnValue({
        sanctum: {
          mode: 'cookie',
        },
      })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            ['set-cookie']: 'header_value',
            ['content-type']: 'application/json',
            ['access-control-allow-credentials']: 'true',
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(useRuntimeConfigMock).toHaveBeenCalled()
      expect(mockLogger.warn).toHaveBeenCalledWith(`[response] 'access-control-allow-origin' header is missing or invalid (expected: http://custom-origin.dev, got: null)`)
    })

    it('writes warning if origin header does not include request origin', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: 'http://custom-origin.dev' })
      useRuntimeConfigMock.mockReturnValue({
        sanctum: {
          mode: 'cookie',
        },
      })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            ['set-cookie']: 'header_value',
            ['content-type']: 'application/json',
            ['access-control-allow-credentials']: 'true',
            ['access-control-allow-origin']: 'http://another-host.dev',
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(useRuntimeConfigMock).toHaveBeenCalled()
      expect(mockLogger.warn).toHaveBeenCalledWith(`[response] 'access-control-allow-origin' header is missing or invalid (expected: http://custom-origin.dev, got: http://another-host.dev)`)
    })

    it('writes warning if origin header does not include origin from config', async () => {
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: 'http://custom-origin.dev' })
      useRuntimeConfigMock.mockReturnValue({
        sanctum: {
          mode: 'cookie',
          origin: 'http://sanctum-host.dev',
        },

        public: {
          sanctum: {
            origin: 'http://client-sanctum-host.dev',
          },
        },
      })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        response: {
          headers: new Headers({
            ['set-cookie']: 'header_value',
            ['content-type']: 'application/json',
            ['access-control-allow-credentials']: 'true',
            ['access-control-allow-origin']: 'http://another-host.dev',
          }),
        },
      })

      await validateResponseHeaders(mockApp, ctx, mockLogger)

      expect(useRuntimeConfigMock).toHaveBeenCalled()
      expect(mockLogger.warn).toHaveBeenCalledWith(`[response] 'access-control-allow-origin' header is missing or invalid (expected: http://sanctum-host.dev, got: http://another-host.dev)`)
    })
  })
})
