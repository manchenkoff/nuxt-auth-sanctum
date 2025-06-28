import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import type { NuxtApp } from '#app'

const ACCEPT_HEADER = 'Accept'

/**
 * Modify request before sending it to the Laravel API
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export async function setRequestParams(
  app: NuxtApp,
  ctx: FetchContext,
  logger: ConsolaInstance,
): Promise<void> {
  const method = ctx.options.method?.toLowerCase() ?? 'get'

  if (!ctx.options.headers?.has(ACCEPT_HEADER)) {
    ctx.options.headers.set(ACCEPT_HEADER, 'application/vnd.api+json, application/json')

    logger.debug(`[request] added default ${ACCEPT_HEADER} header`)
  }

  // https://laravel.com/docs/10.x/routing#form-method-spoofing
  if (method === 'put' && ctx.options.body instanceof FormData) {
    ctx.options.method = 'POST'
    ctx.options.body.append('_method', 'PUT')

    logger.debug('[request] changed PUT to POST method for FormData compatibility')
  }
}
