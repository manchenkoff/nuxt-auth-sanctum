import type { OutgoingHttpHeaders } from 'node:http'
import {
  setResponseHeader,
  splitCookiesString,
  type H3Event,
} from 'h3'
import type { ConsolaInstance } from 'consola'
import type { PublicModuleOptions } from '../types/options'

const SERVER_COOKIE_NAME = 'set-cookie'

/**
 * Request a new CSRF cookie from the API
 * @param config Module configuration
 * @param logger Logger instance
 */
export async function initCsrfCookie(
  config: PublicModuleOptions,
  logger: ConsolaInstance,
): Promise<void> {
  if (config.endpoints.csrf === undefined) {
    throw new Error('`sanctum.endpoints.csrf` is not defined')
  }

  await $fetch(config.endpoints.csrf, {
    baseURL: config.baseUrl,
    credentials: 'include',
  })

  logger.debug('[request] CSRF cookie has been initialized')
}

/**
 * Extract cookies from the remote API response headers
 * @param headers Remote API response headers
 */
export function extractCookiesFromHeaders(headers: Headers | undefined): string[] {
  const cookieHeader = headers?.get(SERVER_COOKIE_NAME)

  if (cookieHeader === undefined || cookieHeader === null) {
    return []
  }

  return splitCookiesString(cookieHeader)
}

/**
 * Extract cookies from the current H3 event headers
 * @param headers HTTP headers collection
 */
export function extractCookiesFromEventHeaders(headers: OutgoingHttpHeaders): string[] {
  const cookieHeader = headers[SERVER_COOKIE_NAME] ?? []

  if (Array.isArray(cookieHeader)) {
    return cookieHeader
  }

  return [cookieHeader]
}

/**
 * Create a map of cookies to deduplicate them
 * @param cookieCollections Arrays of cookies to merge
 */
export function createCookiesMap(...cookieCollections: string[][]) {
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
 * Write cookies to the event response headers.
 *
 * Returns whether the cookies were applied to the response. Returns `false`
 * when the response headers are already committed (e.g. with SSR streaming
 * enabled), in which case the cookies have to be replayed on the client.
 * @param event H3 event instance
 * @param cookiesMap Cookies map
 */
export function writeCookiesToEvent(
  event: H3Event,
  cookiesMap: Map<string, string>,
): boolean {
  if (event.handled || event.node?.res?.headersSent) {
    return false
  }

  try {
    setResponseHeader(event, SERVER_COOKIE_NAME, Array.from(cookiesMap.values()))
    return true
  }
  catch {
    return false
  }
}
