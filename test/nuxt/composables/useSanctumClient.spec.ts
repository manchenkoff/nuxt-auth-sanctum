import { useNuxtApp } from '#app'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ofetch } from 'ofetch'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSanctumClient } from '~/src/runtime/composables/useSanctumClient'

mockNuxtImport(useNuxtApp, original => vi.fn(original))

describe('useSanctumClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns nuxt provided global helper', () => {
    const fetchFn = ofetch.create({ baseURL: 'http://test-host.dev' })

    const useNuxtAppFn = vi
      .mocked(useNuxtApp)
      .getMockImplementation()!

    vi.mocked(useNuxtApp).mockImplementation(
      (...args) => ({
        ...useNuxtAppFn(...args),
        $sanctumClient: fetchFn,
      }),
    )

    const client = useSanctumClient()

    expect(client).toStrictEqual(fetchFn)
  })
})
