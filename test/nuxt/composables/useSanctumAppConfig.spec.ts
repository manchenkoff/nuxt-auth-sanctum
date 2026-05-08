import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSanctumAppConfig } from '~/src/runtime/composables/useSanctumAppConfig'
import type { SanctumAppConfig } from '~/src/runtime/types/config'

const {
  useAppConfigMock,
} = vi.hoisted(() => {
  return {
    useAppConfigMock: vi.fn(),
  }
})

mockNuxtImport('useAppConfig', () => useAppConfigMock)

describe('useSanctumAppConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty config if not set', () => {
    useAppConfigMock.mockReturnValue({})

    const config = useSanctumAppConfig()

    expect(config).toStrictEqual({})
  })

  it('returns correct config if set', () => {
    const payload: SanctumAppConfig = {
      tokenStorage: {
        async get(_app) {
          return undefined
        },
        async set(_app, _token) {
          return
        },
      },
    }

    useAppConfigMock.mockReturnValue({ sanctum: payload })

    const config = useSanctumAppConfig()

    expect(config.tokenStorage).toStrictEqual(payload.tokenStorage)
  })
})
