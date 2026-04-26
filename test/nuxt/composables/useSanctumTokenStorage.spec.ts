import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSanctumAppConfig } from '~/src/runtime/composables/useSanctumAppConfig'
import { useSanctumTokenStorage } from '~/src/runtime/composables/useSanctumTokenStorage'
import type { TokenStorage } from '~/src/runtime/types/config'

describe('useSanctumTokenStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sets token storage implementation config', () => {
    const storage: TokenStorage = {
      async get(_app) {
        return undefined
      },
      async set(_app, _token) {
        return
      },
    }

    expect(useSanctumAppConfig()).toStrictEqual({})

    useSanctumTokenStorage(storage)

    expect(useSanctumAppConfig().tokenStorage).toStrictEqual(storage)
  })
})
