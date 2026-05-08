import { useRuntimeConfig } from '#imports'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSanctumConfig } from '~/src/runtime/composables/useSanctumConfig'
import type { ModuleOptions } from '~/src/runtime/types/options'

const {
  isServerRuntimeMock,
} = vi.hoisted(() => {
  return {
    isServerRuntimeMock: vi.fn(),
  }
})

mockNuxtImport(useRuntimeConfig, original => vi.fn(original))

vi.mock(
  '~/src/runtime/utils/runtime',
  () => ({ isServerRuntime: isServerRuntimeMock }),
)

describe('useSanctumConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns private config in SSR', () => {
    const payload = {
      sanctum: {
        baseUrl: 'http://private-domain.dev',
      },
      public: {
        sanctum: {
          baseUrl: 'http://public-domain.dev',
        },
      },
    } as unknown as ModuleOptions

    const useRuntimeConfigFn = vi
      .mocked(useRuntimeConfig)
      .getMockImplementation()!

    vi.mocked(useRuntimeConfig).mockImplementation(
      (...args) => ({
        ...useRuntimeConfigFn(...args),
        ...payload,
      }),
    )

    isServerRuntimeMock.mockReturnValue(true)

    const config = useSanctumConfig()

    expect(config.baseUrl).toBe('http://private-domain.dev')

    expect(isServerRuntimeMock).toHaveBeenCalled()
    expect(useRuntimeConfig).toHaveBeenCalled()
  })

  it('returns public config in CSR', () => {
    const payload = {
      sanctum: {
        baseUrl: 'http://private-domain.dev',
      },
      public: {
        sanctum: {
          baseUrl: 'http://public-domain.dev',
        },
      },
    } as unknown as ModuleOptions

    const useRuntimeConfigFn = vi
      .mocked(useRuntimeConfig)
      .getMockImplementation()!

    vi.mocked(useRuntimeConfig).mockImplementation(
      (...args) => ({
        ...useRuntimeConfigFn(...args),
        ...payload,
      }),
    )

    isServerRuntimeMock.mockReturnValue(false)

    const config = useSanctumConfig()

    expect(config.baseUrl).toBe('http://public-domain.dev')

    expect(isServerRuntimeMock).toHaveBeenCalled()
    expect(useRuntimeConfig).toHaveBeenCalled()
  })
})
