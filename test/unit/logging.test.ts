import { describe, expect, it } from 'vitest'
import { useSanctumLogger } from '../../src/runtime/utils/logging'

describe('logging', () => {
  describe('useSanctumLogger', () => {
    it('returns a ConsolaInstance', () => {
      const logger = useSanctumLogger(3, false)

      expect(logger).toBeDefined()

      expect(typeof logger.info).toBe('function')
      expect(typeof logger.debug).toBe('function')
      expect(typeof logger.warn).toBe('function')
      expect(typeof logger.error).toBe('function')
      expect(typeof logger.trace).toBe('function')
      expect(typeof logger.log).toBe('function')
    })

    it('applies log level correctly', () => {
      const logger0 = useSanctumLogger(0, false)
      const logger3 = useSanctumLogger(3, false)
      const logger5 = useSanctumLogger(5, false)

      expect(logger0.level).toBe(0)
      expect(logger3.level).toBe(3)
      expect(logger5.level).toBe(5)
    })

    it('creates logger with ssr tag in SSR environment', () => {
      const logger = useSanctumLogger(3, true)
      const tag = logger.options?.defaults?.tag ?? ''

      expect(tag).toMatch('nuxt-auth-sanctum:ssr')
    })

    it('creates logger with csr tag in CSR environment', () => {
      const logger = useSanctumLogger(3, false)
      const tag = logger.options?.defaults?.tag ?? ''

      expect(tag).toMatch('nuxt-auth-sanctum:csr')
    })
  })
})
