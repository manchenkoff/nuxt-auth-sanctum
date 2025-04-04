import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import { appendRequestHeaders } from '../../utils/headers'
import type { NuxtApp } from '#app'

/**
 * Modify request before sending it to the Laravel API
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export default async function handleRequestHeaders(
  app: NuxtApp,
  ctx: FetchContext,
  logger: ConsolaInstance,
): Promise<void> {
  const method = ctx.options.method?.toLowerCase() ?? 'get'

  if (!ctx.options.headers?.has('Accept')) {
    const headersToAdd = { Accept: 'application/json' }

    ctx.options.headers = appendRequestHeaders(
      ctx.options.headers,
      headersToAdd,
    )

    logger.debug(
      '[request] added default headers',
      Object.keys(headersToAdd),
    )
  }

  // https://laravel.com/docs/10.x/routing#form-method-spoofing
  if (method === 'put' && ctx.options.body instanceof FormData) {
    ctx.options.method = 'POST'
    ctx.options.body.append('_method', 'PUT')
  }
}
