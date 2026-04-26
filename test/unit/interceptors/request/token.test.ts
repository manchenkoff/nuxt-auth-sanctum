import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setTokenHeader } from '../../../../src/runtime/interceptors/request/token'
import { createAppMock, createLoggerMock, createMock } from '../../../helpers/mocks'
import type { FetchContext } from 'ofetch'

const {
  useSanctumConfigMock,
  useSanctumAppConfigMock,
} = vi.hoisted(() => {
  return {
    useSanctumConfigMock: vi.fn().mockReturnValue({ mode: 'token' }),
    useSanctumAppConfigMock: vi.fn().mockReturnValue({ tokenStorage: undefined }),
  }
})

vi.mock(
  '../../../../src/runtime/composables/useSanctumConfig',
  () => ({ useSanctumConfig: useSanctumConfigMock }),
)

vi.mock(
  '../../../../src/runtime/composables/useSanctumAppConfig',
  () => ({ useSanctumAppConfig: useSanctumAppConfigMock }),
)

describe('request interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('setTokenHeader', () => {
    it('skips when mode is not token', async () => {
      useSanctumConfigMock.mockReturnValue({ mode: 'cookie' })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        options: {
          headers: new Headers(),
        },
      })

      await setTokenHeader(mockApp, ctx, mockLogger)

      expect(mockLogger.debug).not.toHaveBeenCalled()
      expect(ctx.options.headers?.get('Authorization')).toBeNull()
    })

    it('throws when tokenStorage not defined', async () => {
      useSanctumConfigMock.mockReturnValue({ mode: 'token' })
      useSanctumAppConfigMock.mockReturnValue({ tokenStorage: undefined })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        options: {
          headers: new Headers(),
        },
      })

      await expect(setTokenHeader(mockApp, ctx, mockLogger))
        .rejects
        .toThrow('`sanctum.tokenStorage` is not defined in app.config.ts')
    })

    it('skips when token is not in storage', async () => {
      useSanctumConfigMock.mockReturnValue({ mode: 'token' })
      useSanctumAppConfigMock.mockReturnValue({
        tokenStorage: { get: vi.fn().mockResolvedValue(null) } as unknown,
      })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        options: {
          headers: new Headers(),
        },
      })

      await setTokenHeader(mockApp, ctx, mockLogger)

      expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('[request] authentication token is not set'))
      expect(ctx.options.headers?.get('Authorization')).toBeNull()
    })

    it('sets Bearer token in authorization header', async () => {
      useSanctumConfigMock.mockReturnValue({ mode: 'token' })
      useSanctumAppConfigMock.mockReturnValue({
        tokenStorage: { get: vi.fn().mockResolvedValue('auth_token') } as unknown,
      })

      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        options: {
          headers: new Headers(),
        },
      })

      await setTokenHeader(mockApp, ctx, mockLogger)

      expect(ctx.options.headers?.get('Authorization')).toBe(`Bearer auth_token`)
      expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('[request] added Authorization token header'))
    })
  })
})
