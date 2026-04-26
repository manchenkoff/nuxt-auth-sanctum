import { describe, expect, it } from 'vitest'
import { isServerRuntime } from '../../src/runtime/utils/runtime'

describe('runtime', () => {
  describe('isServerRuntime', () => {
    it('returns import.meta.server value', () => {
      const isServer = import.meta.server

      expect(isServerRuntime()).toBe(isServer)
    })
  })
})
