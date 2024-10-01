import { appendResponseHeader, splitCookiesString } from 'h3'
import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import { navigateTo, useRequestEvent, type NuxtApp } from '#app'

/**
 * Append server response headers to the client response
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
function appendServerResponseHeaders(
  app: NuxtApp,
  ctx: FetchContext,
  logger: ConsolaInstance,
): void {
  const event = useRequestEvent(app)
  const serverCookieName = 'set-cookie'
  const cookieHeader = ctx.response!.headers.get(serverCookieName)

  if (cookieHeader === null || event === undefined) {
    logger.debug(`[response] no cookies to pass to the client [${ctx.request}]`)
    return
  }

  const cookies = splitCookiesString(cookieHeader)
  const cookieNameList = []

  for (const cookie of cookies) {
    appendResponseHeader(event, serverCookieName, cookie)

    const cookieName = cookie.split('=')[0]
    cookieNameList.push(cookieName)
  }

  logger.debug(
    `[response] pass cookies from server to client response`,
    cookieNameList,
  )
}

/**
 * Pass all cookies from the API to the client on SSR response
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export default async function handleResponseHeaders(
  app: NuxtApp,
  ctx: FetchContext,
  logger: ConsolaInstance,
): Promise<void> {
  if (ctx.response === undefined) {
    logger.debug('[response] no response to process')
    return
  }

  if (import.meta.server) {
    appendServerResponseHeaders(app, ctx, logger)
  }

  // follow redirects on client
  if (ctx.response.redirected) {
    await app.runWithContext(
      async () => await navigateTo(ctx.response!.url),
    )
  }
}
