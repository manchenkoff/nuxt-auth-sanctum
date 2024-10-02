import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import { useSanctumConfig } from '../../composables/useSanctumConfig'
import type { ModuleOptions } from '../../types/options'
import { appendRequestHeaders } from '../../utils/headers'
import { type NuxtApp, useCookie, useRequestHeaders, useRequestURL } from '#app'

const SECURE_METHODS = new Set(['post', 'delete', 'put', 'patch'])
const COOKIE_OPTIONS: { readonly: true } = { readonly: true }

/**
 * Pass all cookies, headers and referrer from the client to the API
 * @param headers Headers collection to extend
 * @param config Module configuration
 * @param logger Logger instance
 * @returns Headers collection to pass to the API
 */
function useServerHeaders(
  headers: Headers,
  config: ModuleOptions,
  logger: ConsolaInstance,
): Headers {
  const clientHeaders = useRequestHeaders(['cookie', 'user-agent'])
  const origin = config.origin ?? useRequestURL().origin

  const headersToAdd = {
    Referer: origin,
    Origin: origin,
    ...(clientHeaders.cookie && { Cookie: clientHeaders.cookie }),
    ...(clientHeaders['user-agent'] && { 'User-Agent': clientHeaders['user-agent'] }),
  }

  logger.debug(
    '[request] added client headers to server request',
    Object.keys(headersToAdd),
  )

  return appendRequestHeaders(headers, headersToAdd)
}

/**
 * Request a new CSRF cookie from the API
 * @param config Module configuration
 * @param logger Logger instance
 * @returns {Promise<void>}
 */
async function initCsrfCookie(
  config: ModuleOptions,
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
 * Add CSRF token to the headers collection to pass from the client to the API
 * @param headers Headers collection to extend
 * @param config Module configuration
 * @param logger Logger instance
 * @returns Headers collection to pass to the API
 */
async function useCsrfHeader(
  headers: Headers,
  config: ModuleOptions,
  logger: ConsolaInstance,
): Promise<Headers> {
  if (config.csrf.cookie === undefined) {
    throw new Error('`sanctum.csrf.cookie` is not defined')
  }

  if (config.csrf.header === undefined) {
    throw new Error('`sanctum.csrf.header` is not defined')
  }

  let csrfToken = useCookie(config.csrf.cookie, COOKIE_OPTIONS)

  if (!csrfToken.value) {
    await initCsrfCookie(config, logger)
    csrfToken = useCookie(config.csrf.cookie, COOKIE_OPTIONS)
  }

  if (!csrfToken.value) {
    logger.warn(`${config.csrf.cookie} cookie is missing, unable to set ${config.csrf.header} header`)
    return headers
  }

  const headersToAdd = { [config.csrf.header]: csrfToken.value }

  logger.debug(`[request] added csrf token header`, Object.keys(headersToAdd))

  return appendRequestHeaders(headers, headersToAdd)
}

/**
 * Handle cookies and headers for the request
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export default async function handleRequestCookies(
  app: NuxtApp,
  ctx: FetchContext,
  logger: ConsolaInstance,
): Promise<void> {
  const config = useSanctumConfig()
  const method = ctx.options.method?.toLowerCase() ?? 'get'

  if (import.meta.server) {
    ctx.options.headers = useServerHeaders(
      ctx.options.headers,
      config,
      logger,
    )
  }

  if (SECURE_METHODS.has(method)) {
    ctx.options.headers = await useCsrfHeader(
      ctx.options.headers,
      config,
      logger,
    )
  }
}
