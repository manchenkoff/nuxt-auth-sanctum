import { getResponseHeaders } from 'h3'
import type { ConsolaInstance } from 'consola'
import { useRequestEvent, useRequestHeaders, useState } from '#app'
import type { PublicModuleOptions } from '../types/options'
import { PENDING_COOKIES_STATE_KEY } from './constants'
import {
  createCookiesMap,
  extractCookiesFromEventHeaders,
  extractCookiesFromHeaders,
  initCsrfCookie,
  writeCookiesToEvent,
} from './cookies'
import { escapeRegex } from './formatter'

/**
 * Establishes the CSRF/session cookies during SSR before the response
 * headers are committed.
 *
 * Required to support SSR streaming: with `experimental.ssrStreaming` the
 * headers are flushed with the HTML shell, so any cookie received after that
 * cannot be forwarded to the client. When the browser has not sent the CSRF
 * cookie yet (first visit or expired session), the module fetches a fresh
 * one from the API while the headers are still writable.
 * @param config Module configuration
 * @param logger Logger instance
 */
export async function ensureSsrCsrfCookie(
  config: PublicModuleOptions,
  logger: ConsolaInstance,
): Promise<void> {
  if (config.mode !== 'cookie') {
    return
  }

  if (config.endpoints.csrf === undefined) {
    return
  }

  const csrfName = config.csrf.cookie

  if (csrfName === undefined) {
    return
  }

  const forwardedCookies = useRequestHeaders(['cookie']).cookie

  if (forwardedCookies !== undefined && new RegExp(`(?:^|;)\\s*${escapeRegex(csrfName)}=`).test(forwardedCookies)) {
    return
  }

  const event = useRequestEvent()

  if (event === undefined) {
    return
  }

  try {
    const clientHeaders = useRequestHeaders(['cookie', 'user-agent'])
    const headers: Record<string, string> = {}

    if (clientHeaders.cookie) {
      headers.cookie = clientHeaders.cookie
    }
    if (clientHeaders['user-agent']) {
      headers['user-agent'] = clientHeaders['user-agent']
    }

    const response = await $fetch.raw(config.endpoints.csrf, {
      baseURL: config.baseUrl,
      credentials: 'include',
      headers,
    })

    const eventHeaders = getResponseHeaders(event)
    const cookiesFromResponse = extractCookiesFromHeaders(response.headers)

    const cookiesMap = createCookiesMap(
      extractCookiesFromEventHeaders(eventHeaders),
      cookiesFromResponse,
    )

    writeCookiesToEvent(event, cookiesMap)

    logger.debug('[ssr] CSRF cookie has been initialized before rendering')
  }
  catch (err) {
    logger.warn('[ssr] unable to initialize CSRF cookie before rendering', { reason: err })
  }
}

/**
 * Writes the cookies that could not be forwarded during SSR to the client.
 *
 * The cookies are dropped when the response headers are already committed
 * (SSR streaming). Non-HttpOnly cookies are written to the browser directly.
 * Returns whether an HttpOnly cookie was dropped, which requires a fresh
 * CSRF cookie request to re-establish the session in the browser.
 * @param config Module configuration
 */
export function applyPendingCookies(config: PublicModuleOptions): boolean {
  if (config.mode !== 'cookie') {
    return false
  }

  const pendingCookies = useState<string[]>(PENDING_COOKIES_STATE_KEY, () => [])

  if (pendingCookies.value.length === 0) {
    return false
  }

  let hasHttpOnly = false

  for (const cookie of pendingCookies.value) {
    if (/(?:^|;)\s*httponly(?=[;\s]|$)/i.test(cookie)) {
      hasHttpOnly = true
      continue
    }

    document.cookie = cookie
  }

  pendingCookies.value = []

  return hasHttpOnly
}

/**
 * Re-establishes the session on the client when an HttpOnly cookie was
 * dropped during SSR. The credentialed CSRF request makes the browser store
 * the session cookie natively.
 * @param config Module configuration
 * @param logger Logger instance
 */
export async function replayPendingCookies(
  config: PublicModuleOptions,
  logger: ConsolaInstance,
): Promise<void> {
  if (config.endpoints.csrf === undefined) {
    return
  }

  await initCsrfCookie(config, logger)
}
