import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import type { NitroApp } from 'nitropack'

export default defineNitroPlugin((nitroApp: NitroApp): void => {
  nitroApp.hooks.hook('sanctum:proxy:request', (context: FetchContext, logger: ConsolaInstance) => {
    logger.info('Sanctum proxy request hook triggered', context.request)
  })
})
