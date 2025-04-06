import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import type { NuxtApp } from '#app'

/**
 * Logs information about the API response before it is sent to the client.
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export async function logResponseHeaders(
  app: NuxtApp,
  ctx: FetchContext,
  logger: ConsolaInstance,
): Promise<void> {
  logger.trace(
    `Response headers for "${ctx.request.toString()}"`,
    ctx.response ? Object.fromEntries(ctx.response.headers.entries()) : {},
  )
}
