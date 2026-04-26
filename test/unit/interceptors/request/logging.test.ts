import type { FetchContext } from 'ofetch'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logRequestHeaders } from '../../../../src/runtime/interceptors/request/logging'
import { createAppMock, createLoggerMock, createMock } from '../../../helpers/mocks'

describe('request interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('logRequestHeaders', () => {
    it('writes trace log on request with plain headers object', async () => {
      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        request: new URL('https://example.com/api/user'),
        options: {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token123',
          },
        },
      })

      await logRequestHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.trace).toHaveBeenCalledWith(
        expect.stringContaining('Request headers for "https://example.com/api/user"'),
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token123',
        },
      )
    })

    it('writes trace log on request with Headers instance', async () => {
      const mockApp = createAppMock()
      const mockLogger = createLoggerMock()

      const ctx = createMock<FetchContext>({
        request: new URL('https://example.com/api/user'),
        options: {
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token123',
          }),
        },
      })

      await logRequestHeaders(mockApp, ctx, mockLogger)

      expect(mockLogger.trace).toHaveBeenCalledWith(
        expect.stringContaining('Request headers for "https://example.com/api/user"'),
        {
          'content-type': 'application/json',
          'authorization': 'Bearer token123',
        },
      )
    })
  })
})
