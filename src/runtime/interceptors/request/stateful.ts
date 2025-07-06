import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import { useSanctumConfig } from '../../composables/useSanctumConfig'
import type { PublicModuleOptions } from '../../types/options'
import { type NuxtApp, useCookie, useRequestHeaders, useRequestURL } from '#app'

const SECURE_METHODS = new Set(['post', 'delete', 'put', 'patch'])
const COOKIE_OPTIONS: { readonly: true } = { readonly: true }

/**
 * Pass all cookies, headers and referrer from the client to the API
 * @param headers Headers collection to extend
 * @param config Module configuration
 * @param logger Logger instance
 */
function useClientHeaders(
  headers: Headers,
  config: PublicModuleOptions,
  logger: ConsolaInstance,
): void {
  const clientHeaders = useRequestHeaders(['cookie', 'user-agent'])
  const origin = config.origin ?? useRequestURL().origin

  const headersToAdd = {
    Referer: origin,
    Origin: origin,
    ...(clientHeaders.cookie && { Cookie: clientHeaders.cookie }),
    ...(clientHeaders['user-agent'] && { 'User-Agent': clientHeaders['user-agent'] }),
  }

  for (const [key, value] of Object.entries(headersToAdd)) {
    headers.set(key, value)
  }

  logger.debug(
    '[request] added client headers to server request',
    Object.keys(headersToAdd),
  )
}

/**
 * Request a new CSRF cookie from the API
 * @param config Module configuration
 * @param logger Logger instance
 */
async function initCsrfCookie(
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
 * Add CSRF token to the headers collection to pass from the client to the API
 * @param headers Headers collection to extend
 * @param config Module configuration
 * @param logger Logger instance
 */
async function useCsrfHeader(
  headers: Headers,
  config: PublicModuleOptions,
  logger: ConsolaInstance,
): Promise<void> {
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
    return
  }

  headers.set(config.csrf.header, csrfToken.value)

  logger.debug(`[request] added ${config.csrf.header} header`)
}

/**
 * Handle cookies and headers for the request
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export async function setStatefulParams(
  app: NuxtApp,
  ctx: FetchContext,
  logger: ConsolaInstance,
): Promise<void> {
  const config = useSanctumConfig()

  if (config.mode !== 'cookie') {
    return
  }

  const method = ctx.options.method?.toLowerCase() ?? 'get'

  if (import.meta.server) {
    useClientHeaders(
      ctx.options.headers,
      config,
      logger,
    )
  }

  if (SECURE_METHODS.has(method)) {
    await useCsrfHeader(
      ctx.options.headers,
      config,
      logger,
    )
  }
}
