import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setRequestParams } from '../../../../src/runtime/interceptors/request/params'
import { createMock } from '../../../helpers/mocks'
import type { FetchContext } from 'ofetch'
import type { NuxtApp } from '#app'
import type { ConsolaInstance } from 'consola'

describe('request interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('setRequestParams', () => {
    it('sets application/json accept header if not set', async () => {
      const mockApp = createMock<NuxtApp>()
      const mockLogger = createMock<ConsolaInstance>({ debug: vi.fn() })

      const ctx = createMock<FetchContext>({
        options: {
          method: 'GET',
          headers: new Headers(),
        },
      })

      await setRequestParams(mockApp, ctx, mockLogger)

      expect(ctx.options.headers?.get('Accept')).toBe('application/json')
      expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('[request] added default Accept header'))
    })

    it('does not override existing accept header', async () => {
      const mockApp = createMock<NuxtApp>()
      const mockLogger = createMock<ConsolaInstance>({ debug: vi.fn() })

      const ctx = createMock<FetchContext>({
        options: {
          method: 'GET',
          headers: new Headers({ Accept: 'application/xml' }),
        },
      })

      await setRequestParams(mockApp, ctx, mockLogger)

      expect(ctx.options.headers?.get('Accept')).toBe('application/xml')
      expect(mockLogger.debug).not.toHaveBeenCalled()
    })

    it('updates FormData body on PUT requests', async () => {
      const mockApp = createMock<NuxtApp>()
      const mockLogger = createMock<ConsolaInstance>({ debug: vi.fn() })

      const formData = new FormData()
      formData.append('name', 'test')

      const ctx = createMock<FetchContext>({
        options: {
          method: 'PUT',
          headers: new Headers(),
          body: formData,
        },
      })

      await setRequestParams(mockApp, ctx, mockLogger)

      expect(ctx.options.method).toBe('POST')
      expect((ctx.options.body as FormData)!.get('_method')).toBe('PUT')
      expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('[request] changed PUT to POST method'))
    })

    it('does not modify non-FormData PUT body', async () => {
      const mockApp = createMock<NuxtApp>()
      const mockLogger = createMock<ConsolaInstance>({ debug: vi.fn() })

      const ctx = createMock<FetchContext>({
        options: {
          method: 'PUT',
          headers: new Headers({ Accept: 'application/json' }),
          body: { name: 'test' },
        },
      })

      await setRequestParams(mockApp, ctx, mockLogger)

      expect(ctx.options.method).toBe('PUT')
      expect(mockLogger.debug).not.toHaveBeenCalled()
    })
  })
})