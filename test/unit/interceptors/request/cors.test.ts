import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setRequestOrigin } from '../../../../src/runtime/interceptors/request/cors'
import { createAppMock, createLoggerMock, createMock } from '../../../helpers/mocks'
import type { FetchContext } from 'ofetch'

const {
  useSanctumConfigMock,
  isServerRuntimeMock,
  useRequestURLMock,
} = vi.hoisted(() => {
  return {
    useSanctumConfigMock: vi.fn(),
    isServerRuntimeMock: vi.fn(),
    useRequestURLMock: vi.fn(),
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
    useRequestURL: useRequestURLMock,
  }),
)

describe('request interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('setRequestOrigin', () => {
    it('no-op when client request is CSR', async () => {
      isServerRuntimeMock.mockReturnValue(false)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({})

      await setRequestOrigin(mockApp, ctx, mockLogger)

      expect(isServerRuntimeMock).toHaveBeenCalled()
      expect(mockLogger.debug).not.toHaveBeenCalled()
    })

    it('appends client headers in SSR [origin, referrer]', async () => {
      useSanctumConfigMock.mockReturnValue({
        origin: 'http://custom-origin.dev',
      })
      isServerRuntimeMock.mockReturnValue(true)

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        options: {
          method: undefined,
          headers: new Headers(),
        },
      })

      await setRequestOrigin(mockApp, ctx, mockLogger)

      expect(ctx.options.headers).toStrictEqual(
        new Headers({
          Referer: 'http://custom-origin.dev',
          Origin: 'http://custom-origin.dev',
        }),
      )

      expect(isServerRuntimeMock).toHaveBeenCalled()
      expect(useRequestURLMock).not.toHaveBeenCalled()
      expect(mockLogger.debug).toHaveBeenCalledWith(
        '[request] added origin headers to server request',
        ['Referer', 'Origin'],
      )
    })

    it('appends request origin if not provided', async () => {
      useSanctumConfigMock.mockReturnValue({})
      isServerRuntimeMock.mockReturnValue(true)
      useRequestURLMock.mockReturnValue({ origin: 'http://custom-origin.dev' })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        options: {
          method: undefined,
          headers: new Headers(),
        },
      })

      await setRequestOrigin(mockApp, ctx, mockLogger)

      expect(ctx.options.headers).toStrictEqual(
        new Headers({
          Referer: 'http://custom-origin.dev',
          Origin: 'http://custom-origin.dev',
        }),
      )

      expect(isServerRuntimeMock).toHaveBeenCalled()
      expect(useRequestURLMock).toHaveBeenCalled()
      expect(mockLogger.debug).toHaveBeenCalledWith(
        '[request] added origin headers to server request',
        ['Referer', 'Origin'],
      )
    })
  })
})
