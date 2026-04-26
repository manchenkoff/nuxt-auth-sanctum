import type { FetchContext } from 'ofetch'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { logResponseHeaders } from '../../../../src/runtime/interceptors/response/logging'
import { createAppMock, createLoggerMock, createMock } from '../../../helpers/mocks'

describe('response interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('logResponseHeaders', () => {
    it('writes headers when response is not empty', async () => {
      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        request: new URL('https://example.com/api/user'),
        response: {
          headers: new Headers({
            'Content-Type': 'application/json',
            'X-Custom-Header': 'value123',
          }),
        },
      })

      await logResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.trace).toHaveBeenCalledWith(
        expect.stringContaining('Response headers for "https://example.com/api/user"'),
        {
          'content-type': 'application/json',
          'x-custom-header': 'value123',
        },
      )
    })

    it('writes empty object when response is empty', async () => {
      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        request: new URL('https://example.com/api/user'),
        response: undefined,
      })

      await logResponseHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.trace).toHaveBeenCalledWith(
        expect.stringContaining('Response headers for "https://example.com/api/user"'),
        {},
      )
    })
  })
})
