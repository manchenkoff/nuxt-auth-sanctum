import { describe, expect, it } from 'vitest'
import { IDENTITY_LOADED_KEY } from '../../src/runtime/utils/constants'

describe('constants', () => {
  it('has expected identity key', () => {
    expect(IDENTITY_LOADED_KEY).toBe('sanctum.user.loaded')
  })
})
