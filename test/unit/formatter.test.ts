import { describe, expect, it } from 'vitest'
import { trimTrailingSlash } from '../../src/runtime/utils/formatter'

describe('formatters', () => {
  describe('trimTrailingSlash', () => {
    it('does not remove root slash', () => {
      const value = '/'
      expect(trimTrailingSlash(value)).toBe(value)
    })

    it('returns unchanged string if correct', () => {
      const value = '/home'
      expect(trimTrailingSlash(value)).toBe(value)
    })

    it('returns path without trailing slash', () => {
      const value = '/home/'
      expect(trimTrailingSlash(value)).toBe('/home')
    })

    it('removes only one slash', () => {
      const value = '/home//'
      expect(trimTrailingSlash(value)).toBe('/home/')
    })
  })
})
