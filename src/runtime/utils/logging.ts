import { createConsola } from 'consola'
import type { ConsolaInstance } from 'consola'

const LOGGER_NAME = 'nuxt-auth-sanctum'

export function useSanctumLogger(logLevel: number, server: boolean): ConsolaInstance {
  const envSuffix = server ? 'ssr' : 'csr'
  const loggerName = LOGGER_NAME + ':' + envSuffix

  return createConsola({ level: logLevel }).withTag(loggerName)
}
