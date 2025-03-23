import type { OutgoingHttpHeaders } from 'node:http'
import { getResponseHeaders, type H3Event, setResponseHeaders, splitCookiesString, type TypedHeaders } from 'h3'
import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import { navigateTo, useRequestEvent, type NuxtApp } from '#app'

const ServerCookieName = 'set-cookie'

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
  const cookiesFromResponse = extractCookiesFromResponse(ctx, logger)

  const cookiesMap = createCookiesMap(cookiesFromEvent, cookiesFromResponse)

  writeCookiesToEventResponse(event, eventHeaders, cookiesMap)

  logger.debug(
    `[response] pass cookies from server to client response`,
    Array.from(cookiesMap.keys()),
  )
}

/**
 * Extract cookies from the current H3 event headers
 * @param headers HTTP headers collection
 */
function extractCookiesFromEventHeaders(headers: OutgoingHttpHeaders): string[] {
  const cookieHeader = headers[ServerCookieName] ?? []

  if (Array.isArray(cookieHeader)) {
    return cookieHeader
  }

  return [cookieHeader]
}

/**
 * Extract cookies from the remote API response headers
 * @param ctx Remote API fetch context
 * @param logger Module logger instance
 */
function extractCookiesFromResponse(ctx: FetchContext, logger: ConsolaInstance): string[] {
  const cookieHeader = ctx.response!.headers.get(ServerCookieName)

  if (cookieHeader === null) {
    logger.debug(`[response] no cookies to pass to the client [${ctx.request}]`)
    return []
  }

  return splitCookiesString(cookieHeader)
}

/**
 * Create a map of cookies to deduplicate them
 * @param cookieCollections Arrays of cookies to merge
 */
function createCookiesMap(...cookieCollections: string[][]) {
  const cookiesMap = new Map<string, string>()

  for (const cookies of cookieCollections) {
    for (const cookie of cookies) {
      const cookieName = cookie.split('=')[0]

      if (cookieName === undefined) {
        continue
      }

      cookiesMap.set(cookieName, cookie)
    }
  }

  return cookiesMap
}

/**
 * Write cookies to the event response headers, keeping the original headers
 * @param event H3 event instance
 * @param headers HTTP headers collection
 * @param cookiesMap Cookies map
 */
function writeCookiesToEventResponse(event: H3Event, headers: OutgoingHttpHeaders, cookiesMap: Map<string, string>) {
  const mergedHeaders = {
    ...headers,
    [ServerCookieName]: Array.from(cookiesMap.values()),
  } as TypedHeaders

  setResponseHeaders(event, mergedHeaders)
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
    const redirectUrl = ctx.response!.url

    await app.callHook('sanctum:redirect', redirectUrl)
    await app.runWithContext(async () => await navigateTo(redirectUrl))
  }
}
