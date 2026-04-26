import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { determineCredentialsMode } from '../../src/runtime/utils/credentials'

describe('credentials', () => {
  let deleteCredentials: () => boolean

  beforeEach(() => {
    deleteCredentials = () => delete (global.Request.prototype as unknown as Record<string, unknown>)['credentials']
  })

  afterEach(() => {
    Object.defineProperty(global.Request.prototype, 'credentials', {
      value: { toString: () => 'include' },
      writable: true,
      configurable: true,
    })
  })

  it('returns "include" when credentials are supported', () => {
    expect(determineCredentialsMode()).toBe('include')
  })

  it('returns "undefined" when credentials are not supported', () => {
    deleteCredentials()
    expect(determineCredentialsMode()).toBeUndefined()
  })
})
