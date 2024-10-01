import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import { useSanctumConfig } from '../../composables/useSanctumConfig'
import type { ModuleOptions } from '../../types/options'
import { type NuxtApp, useCookie, useRequestHeaders, useRequestURL } from '#app'

const SECURE_METHODS = new Set(['post', 'delete', 'put', 'patch'])
const COOKIE_OPTIONS: { readonly: true } = { readonly: true }

/**
 * Pass all cookies, headers and referrer from the client to the API
 * @param headers Headers collection to extend
 * @param config Module configuration
 */
function useServerHeaders(
  headers: HeadersInit | undefined,
  config: ModuleOptions,
): HeadersInit {
  const clientHeaders = useRequestHeaders(['cookie', 'user-agent'])
  const origin = config.origin ?? useRequestURL().origin

  return Object.assign(
    headers || {},
    {
      Referer: origin,
      Origin: origin,
      ...(clientHeaders.cookie && { Cookie: clientHeaders.cookie }),
      ...(clientHeaders['user-agent'] && { 'User-Agent': clientHeaders['user-agent'] }),
    },
  )
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
  await $fetch(config.endpoints.csrf!, {
    baseURL: config.baseUrl,
    credentials: 'include',
  })

  logger.debug('CSRF cookie has been initialized')
}

/**
 * Add CSRF token to the headers collection to pass from the client to the API
 * @param headers Headers collection to extend
 * @param config Module configuration
 * @param logger Logger instance
 */
async function useCsrfHeader(
  headers: HeadersInit | undefined,
  config: ModuleOptions,
  logger: ConsolaInstance,
): Promise<HeadersInit> {
  let csrfToken = useCookie(config.csrf.cookie!, COOKIE_OPTIONS)

  if (!csrfToken.value) {
    await initCsrfCookie(config, logger)

    csrfToken = useCookie(config.csrf.cookie!, COOKIE_OPTIONS)
  }

  if (!csrfToken.value) {
    logger.warn(
      `${config.csrf.cookie} cookie is missing, unable to set ${config.csrf.header} header`,
    )

    return headers || {}
  }

  logger.debug(`Added ${config.csrf.header} header to pass to the API`)

  return Object.assign(
    headers || {},
    { [config.csrf.header!]: csrfToken.value },
  )
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
    ctx.options.headers = useServerHeaders(ctx.options.headers, config)
  }

  if (SECURE_METHODS.has(method)) {
    ctx.options.headers = await useCsrfHeader(
      ctx.options.headers,
      config,
      logger,
    )
  }

  logger.debug(
    '[handleRequestCookies] headers modified',
    Object.keys(ctx.options.headers!),
  )
}
