import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setStatefulParams } from '../../../../src/runtime/interceptors/request/stateful'
import { createAppMock, createLoggerMock, createMock } from '../../../helpers/mocks'
import { TEST_CONFIG, HTTP_METHODS_REQUIRING_CSRF } from '../../../helpers/constants'
import type { FetchContext } from 'ofetch'

const {
  useSanctumConfigMock,
  isServerRuntimeMock,
  useRequestHeadersMock,
  useRequestURLMock,
  useCookieMock,
  refreshCookieMock,
  fetchMock,
} = vi.hoisted(() => {
  return {
    useSanctumConfigMock: vi.fn(),
    isServerRuntimeMock: vi.fn(),
    useRequestHeadersMock: vi.fn(),
    useRequestURLMock: vi.fn(),
    useCookieMock: vi.fn(),
    refreshCookieMock: vi.fn(),
    fetchMock: vi.fn(),
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
    useRequestHeaders: useRequestHeadersMock,
    useRequestURL: useRequestURLMock,
    useCookie: useCookieMock,
    refreshCookie: refreshCookieMock,
  }),
)

vi.stubGlobal('$fetch', fetchMock)

describe('request interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('setStatefulParams', () => {
    it('no-op when token mode is enabled', async () => {
      useSanctumConfigMock.mockReturnValue({ mode: 'token' })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({})

      await setStatefulParams(mockApp, ctx, mockLogger)

      expect(isServerRuntimeMock).not.toHaveBeenCalled()
      expect(mockLogger.debug).not.toHaveBeenCalled()
    })

    it('skips client headers in CSR', async () => {
      useSanctumConfigMock.mockReturnValue({ mode: 'cookie' })
      isServerRuntimeMock.mockReturnValue(false)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        options: { method: undefined },
      })

      await setStatefulParams(mockApp, ctx, mockLogger)

      expect(isServerRuntimeMock).toHaveBeenCalled()
      expect(mockLogger.debug).not.toHaveBeenCalled()
    })

    it('appends client headers in SSR [cookie, user-agent, origin]', async () => {
      useSanctumConfigMock.mockReturnValue({
        mode: 'cookie',
        origin: TEST_CONFIG.CUSTOM_ORIGIN,
      })
      isServerRuntimeMock.mockReturnValue(true)
      useRequestHeadersMock.mockReturnValue({
        'cookie': 'random-cookie=value',
        'user-agent': 'random-user-agent',
      })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        options: {
          method: undefined,
          headers: new Headers(),
        },
      })

      await setStatefulParams(mockApp, ctx, mockLogger)

      expect(ctx.options.headers).toStrictEqual(
        new Headers({
          'Referer': TEST_CONFIG.CUSTOM_ORIGIN,
          'Origin': TEST_CONFIG.CUSTOM_ORIGIN,
          'Cookie': 'random-cookie=value',
          'User-Agent': 'random-user-agent',
        }),
      )

      expect(isServerRuntimeMock).toHaveBeenCalled()
      expect(useRequestHeadersMock).toHaveBeenCalledWith(['cookie', 'user-agent'])
      expect(useRequestURLMock).not.toHaveBeenCalled()
      expect(mockLogger.debug).toHaveBeenCalledWith(
        '[request] added client headers to server request',
        ['Referer', 'Origin', 'Cookie', 'User-Agent'],
      )
    })

    it('appends request origin if not provided', async () => {
      useSanctumConfigMock.mockReturnValue({ mode: 'cookie' })
      isServerRuntimeMock.mockReturnValue(true)
      useRequestHeadersMock.mockReturnValue({
        'cookie': 'random-cookie=value',
        'user-agent': 'random-user-agent',
      })
      useRequestURLMock.mockReturnValue({ origin: TEST_CONFIG.CUSTOM_ORIGIN })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        options: {
          method: undefined,
          headers: new Headers(),
        },
      })

      await setStatefulParams(mockApp, ctx, mockLogger)

      expect(ctx.options.headers).toStrictEqual(
        new Headers({
          'Referer': TEST_CONFIG.CUSTOM_ORIGIN,
          'Origin': TEST_CONFIG.CUSTOM_ORIGIN,
          'Cookie': 'random-cookie=value',
          'User-Agent': 'random-user-agent',
        }),
      )

      expect(isServerRuntimeMock).toHaveBeenCalled()
      expect(useRequestHeadersMock).toHaveBeenCalledWith(['cookie', 'user-agent'])
      expect(useRequestURLMock).toHaveBeenCalled()
      expect(mockLogger.debug).toHaveBeenCalledWith(
        '[request] added client headers to server request',
        ['Referer', 'Origin', 'Cookie', 'User-Agent'],
      )
    })

    describe.each(HTTP_METHODS_REQUIRING_CSRF)('appends CSRF for %s method', (method) => {
      it(`appends CSRF for ${method} method`, async () => {
        useSanctumConfigMock.mockReturnValue({
          mode: 'cookie',
          csrf: {
            cookie: TEST_CONFIG.CSRF_COOKIE_NAME,
            header: TEST_CONFIG.CSRF_HEADER_NAME,
          },
        })
        isServerRuntimeMock.mockReturnValue(false)
        useCookieMock.mockReturnValue({ value: TEST_CONFIG.CSRF_TOKEN })

        const mockApp = createAppMock()
        const mockLogger = createLoggerMock()

        const ctx = createMock<FetchContext>({
          options: {
            method: method.toLowerCase() as 'post' | 'put' | 'patch' | 'delete',
            headers: new Headers(),
          },
        })

        await setStatefulParams(mockApp, ctx, mockLogger)

        expect(ctx.options.headers).toStrictEqual(
          new Headers({
            [TEST_CONFIG.CSRF_HEADER_NAME]: TEST_CONFIG.CSRF_TOKEN,
          }),
        )

        expect(isServerRuntimeMock).toHaveBeenCalled()
        expect(useRequestHeadersMock).not.toHaveBeenCalled()
        expect(useRequestURLMock).not.toHaveBeenCalled()
        expect(useCookieMock).toHaveBeenCalledWith(
          TEST_CONFIG.CSRF_COOKIE_NAME,
          { readonly: true, watch: false },
        )
        expect(mockLogger.debug).toHaveBeenCalledWith('[request] added header_name header')
      })
    })

    it('throws error if cookie name is undefined', async () => {
      useSanctumConfigMock.mockReturnValue({
        mode: 'cookie',
        csrf: {
          cookie: undefined,
          header: undefined,
        },
      })
      isServerRuntimeMock.mockReturnValue(false)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        options: {
          method: 'post',
          headers: new Headers(),
        },
      })

      await expect(setStatefulParams(mockApp, ctx, mockLogger))
        .rejects
        .toThrow('`sanctum.csrf.cookie` is not defined')

      expect(isServerRuntimeMock).toHaveBeenCalled()
      expect(useRequestHeadersMock).not.toHaveBeenCalled()
      expect(useRequestURLMock).not.toHaveBeenCalled()
      expect(mockLogger.debug).not.toHaveBeenCalled()
    })

    it('throws error if cookie header name is undefined', async () => {
      useSanctumConfigMock.mockReturnValue({
        mode: 'cookie',
        csrf: {
          cookie: TEST_CONFIG.CSRF_COOKIE_NAME,
          header: undefined,
        },
      })
      isServerRuntimeMock.mockReturnValue(false)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        options: {
          method: 'post',
          headers: new Headers(),
        },
      })

      await expect(setStatefulParams(mockApp, ctx, mockLogger))
        .rejects
        .toThrow('`sanctum.csrf.header` is not defined')

      expect(isServerRuntimeMock).toHaveBeenCalled()
      expect(useRequestHeadersMock).not.toHaveBeenCalled()
      expect(useRequestURLMock).not.toHaveBeenCalled()
      expect(mockLogger.debug).not.toHaveBeenCalled()
    })

    it('requests CSRF token if not fetched yet', async () => {
      useSanctumConfigMock.mockReturnValue({
        mode: 'cookie',
        baseUrl: TEST_CONFIG.CUSTOM_BASE_URL,
        csrf: {
          cookie: TEST_CONFIG.CSRF_COOKIE_NAME,
          header: TEST_CONFIG.CSRF_HEADER_NAME,
        },
        endpoints: {
          csrf: TEST_CONFIG.CSRF_ENDPOINT,
        },
      })
      isServerRuntimeMock.mockReturnValue(false)

      const csrfToken = { value: undefined as string | undefined }

      useCookieMock.mockImplementation(() => csrfToken)
      fetchMock.mockImplementation(() => csrfToken.value = 'token-value')

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        options: {
          method: 'delete',
          headers: new Headers(),
        },
      })

      await setStatefulParams(mockApp, ctx, mockLogger)

      expect(ctx.options.headers).toStrictEqual(
        new Headers({
          [TEST_CONFIG.CSRF_HEADER_NAME]: 'token-value',
        }),
      )

      expect(isServerRuntimeMock).toHaveBeenCalled()
      expect(useRequestHeadersMock).not.toHaveBeenCalled()
      expect(useRequestURLMock).not.toHaveBeenCalled()
      expect(useCookieMock).toHaveBeenCalledWith(
        TEST_CONFIG.CSRF_COOKIE_NAME,
        { readonly: true, watch: false },
      )
      expect(fetchMock).toHaveBeenCalledWith(TEST_CONFIG.CSRF_ENDPOINT, {
        baseURL: TEST_CONFIG.CUSTOM_BASE_URL,
        credentials: 'include',
      })
      expect(mockLogger.debug).toHaveBeenCalledWith('[request] CSRF cookie has been initialized')
      expect(refreshCookieMock).toHaveBeenCalledWith(TEST_CONFIG.CSRF_COOKIE_NAME)
      expect(mockLogger.warn).not.toHaveBeenCalled()
      expect(mockLogger.debug).toHaveBeenCalledWith('[request] added header_name header')
    })

    it('throws error if csrf endpoint is undefined', async () => {
      useSanctumConfigMock.mockReturnValue({
        mode: 'cookie',
        csrf: {
          cookie: TEST_CONFIG.CSRF_COOKIE_NAME,
          header: TEST_CONFIG.CSRF_HEADER_NAME,
        },
        endpoints: {
          csrf: undefined,
        },
      })
      isServerRuntimeMock.mockReturnValue(false)
      useCookieMock.mockReturnValue({ value: undefined })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        options: {
          method: 'delete',
          headers: new Headers(),
        },
      })

      await expect(setStatefulParams(mockApp, ctx, mockLogger))
        .rejects
        .toThrow('`sanctum.endpoints.csrf` is not defined')

      expect(isServerRuntimeMock).toHaveBeenCalled()
      expect(useRequestHeadersMock).not.toHaveBeenCalled()
      expect(useRequestURLMock).not.toHaveBeenCalled()
      expect(useCookieMock).toHaveBeenCalledWith(
        TEST_CONFIG.CSRF_COOKIE_NAME,
        { readonly: true, watch: false },
      )
      expect(refreshCookieMock).not.toHaveBeenCalled()
      expect(mockLogger.debug).not.toHaveBeenCalled()
    })

    it('writes warning if no CSRF token returned from API', async () => {
      useSanctumConfigMock.mockReturnValue({
        mode: 'cookie',
        baseUrl: TEST_CONFIG.CUSTOM_BASE_URL,
        csrf: {
          cookie: TEST_CONFIG.CSRF_COOKIE_NAME,
          header: TEST_CONFIG.CSRF_HEADER_NAME,
        },
        endpoints: {
          csrf: TEST_CONFIG.CSRF_ENDPOINT,
        },
      })
      isServerRuntimeMock.mockReturnValue(false)
      useCookieMock.mockReturnValue({ value: undefined })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        options: {
          method: 'delete',
          headers: new Headers(),
        },
      })

      await setStatefulParams(mockApp, ctx, mockLogger)

      expect(isServerRuntimeMock).toHaveBeenCalled()
      expect(useRequestHeadersMock).not.toHaveBeenCalled()
      expect(useRequestURLMock).not.toHaveBeenCalled()
      expect(useCookieMock).toHaveBeenCalledWith(
        TEST_CONFIG.CSRF_COOKIE_NAME,
        { readonly: true, watch: false },
      )
      expect(fetchMock).toHaveBeenCalledWith(TEST_CONFIG.CSRF_ENDPOINT, {
        baseURL: TEST_CONFIG.CUSTOM_BASE_URL,
        credentials: 'include',
      })
      expect(mockLogger.debug).toHaveBeenCalledWith('[request] CSRF cookie has been initialized')
      expect(refreshCookieMock).toHaveBeenCalledWith(TEST_CONFIG.CSRF_COOKIE_NAME)
      expect(mockLogger.warn).toHaveBeenCalledWith('cookie_name cookie is missing, unable to set header_name header')
      expect(mockLogger.debug).not.toHaveBeenCalledWith('[request] added header_name header')
    })
  })
})