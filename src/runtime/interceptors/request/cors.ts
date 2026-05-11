import { useRequestURL, type NuxtApp } from '#app'
import type { ConsolaInstance } from 'consola'
import type { FetchContext } from 'ofetch'
import { isServerRuntime } from '../../utils/runtime'
import { useSanctumConfig } from '../../composables/useSanctumConfig'

/**
 * Handle origin/referrer headers for the request
 * @param _app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export async function setRequestOrigin(_app: NuxtApp, ctx: FetchContext, logger: ConsolaInstance) {
  if (!isServerRuntime()) {
    return
  }

  const config = useSanctumConfig()
  const origin = config.origin ?? useRequestURL().origin

  const headersToAdd = {
    Referer: origin,
    Origin: origin,
  }

  for (const [key, value] of Object.entries(headersToAdd)) {
    ctx.options.headers.set(key, value)
  }

  logger.debug(
    '[request] added origin headers to server request',
    Object.keys(headersToAdd),
  )
}
