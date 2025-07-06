import { createConsola } from 'consola'
import type { ConsolaInstance } from 'consola'

const LOGGER_NAME = 'nuxt-auth-sanctum'

export function useSanctumLogger(logLevel: number): ConsolaInstance {
  const envSuffix = import.meta.server ? 'ssr' : 'csr'
  const loggerName = LOGGER_NAME + ':' + envSuffix

  return createConsola({ level: logLevel }).withTag(loggerName)
}
