import { getResponseHeaders } from 'h3'
import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import { useSanctumConfig } from '../../composables/useSanctumConfig'
import { navigateTo, useRequestEvent, useState } from '#app'
import type { NuxtApp } from '#app'
import { isServerRuntime } from '../../utils/runtime'
import { PENDING_COOKIES_STATE_KEY } from '../../utils/constants'
import {
  createCookiesMap,
  extractCookiesFromEventHeaders,
  extractCookiesFromHeaders,
  writeCookiesToEvent,
} from '../../utils/cookies'

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

  if (event === undefined) {
    logger.debug(`[response] no event to pass cookies to the client [${ctx.request}]`)
    return
  }

  const eventHeaders = getResponseHeaders(event)

  const cookiesFromEvent = extractCookiesFromEventHeaders(eventHeaders)
  const cookiesFromResponse = extractCookiesFromHeaders(ctx.response?.headers)

  if (cookiesFromResponse.length === 0) {
    logger.debug(`[response] no cookies to pass to the client [${ctx.request}]`)
    return
  }

  const cookiesMap = createCookiesMap(cookiesFromEvent, cookiesFromResponse)

  const applied = writeCookiesToEvent(event, cookiesMap)

  if (!applied) {
    // the response headers are already committed (e.g. SSR streaming enabled),
    // the cookies will be replayed on the client after hydration
    const pendingCookies = useState<string[]>(PENDING_COOKIES_STATE_KEY, () => [])
    const uniqueCookies = createCookiesMap(pendingCookies.value, cookiesFromResponse)

    pendingCookies.value = Array.from(uniqueCookies.values())

    logger.warn('[response] response headers are already sent, cookies will be replayed on the client')
    return
  }

  logger.debug(
    '[response] pass cookies from server to client response',
    Array.from(cookiesMap.keys()),
  )
}

/**
 * Pass all cookies from the API to the client on SSR response
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export async function proxyResponseHeaders(
  app: NuxtApp,
  ctx: FetchContext,
  logger: ConsolaInstance,
): Promise<void> {
  const config = useSanctumConfig()

  if (config.mode !== 'cookie') {
    return
  }

  if (ctx.response === undefined) {
    logger.debug('[response] no response to process')
    return
  }

  if (isServerRuntime()) {
    appendServerResponseHeaders(app, ctx, logger)
  }

  // follow redirects on a client
  if (ctx.response.redirected) {
    const redirectUrl = ctx.response!.url

    await app.callHook('sanctum:redirect', redirectUrl)
    await app.runWithContext(async () => await navigateTo(redirectUrl))
  }
}
