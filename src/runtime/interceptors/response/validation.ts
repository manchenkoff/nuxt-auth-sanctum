import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import type { PublicModuleOptions } from '../../types/options'
import { useRequestURL } from '#app'
import type { NuxtApp } from '#app'

type HeaderValidator = (headers: Headers, config: PublicModuleOptions, logger: ConsolaInstance) => void

/**
 * Checks if the `set-cookie` header is present in the response headers.
 * @param headers The response headers
 * @param config Module options
 * @param logger Logger instance
 */
const validateCookieHeader: HeaderValidator = (
  headers: Headers,
  config: PublicModuleOptions,
  logger: ConsolaInstance,
): void => {
  if (config.mode == 'token') {
    return
  }

  if (!headers.has('set-cookie')) {
    logger.warn('[response] `set-cookie` header is missing, CSRF token will not be set')
  }
}

/**
 * Checks if the `content-type` header is present and valid in the response headers.
 * @param headers The response headers
 * @param config Module options
 * @param logger Logger instance
 */
const validateContentTypeHeader: HeaderValidator = (
  headers: Headers,
  config: PublicModuleOptions,
  logger: ConsolaInstance,
): void => {
  const contentType = headers.get('content-type')

  if (!contentType) {
    logger.warn('[response] "content-type" header is missing')
    return
  }

  if (!contentType.includes('application/json')) {
    logger.debug(`[response] 'content-type' is present in response but different (expected: application/json, got: ${contentType})`)
  }
}

/**
 * Checks if the `access-control-allow-credentials` header is present in the response headers.
 * @param headers The response headers
 * @param config Module options
 * @param logger Logger instance
 */
const validateCredentialsHeader: HeaderValidator = (
  headers: Headers,
  config: PublicModuleOptions,
  logger: ConsolaInstance,
): void => {
  if (config.mode == 'token') {
    return
  }

  const allowCredentials = headers.get('access-control-allow-credentials')

  if (!allowCredentials || allowCredentials !== 'true') {
    logger.warn(`[response] 'access-control-allow-credentials' header is missing or invalid (expected: true, got: ${allowCredentials})`)
  }
}

/**
 * Checks if the `access-control-allow-origin` header is the same as the current origin.
 * @param headers The response headers
 * @param config Module options
 * @param logger Logger instance
 */
const validateOriginHeader: HeaderValidator = (
  headers: Headers,
  config: PublicModuleOptions,
  logger: ConsolaInstance,
): void => {
  const allowOrigin = headers.get('access-control-allow-origin')
  const currentOrigin = config?.origin ?? useRequestURL().origin

  if (!allowOrigin || !allowOrigin.includes(currentOrigin)) {
    logger.warn(`[response] 'access-control-allow-origin' header is missing or invalid (expected: ${currentOrigin}, got: ${allowOrigin})`)
  }
}

const validators: HeaderValidator[] = [
  validateCookieHeader,
  validateContentTypeHeader,
  validateCredentialsHeader,
  validateOriginHeader,
]

/**
 * Validate response headers and log warnings if any are missing or invalid.
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export async function validateResponseHeaders(
  app: NuxtApp,
  ctx: FetchContext,
  logger: ConsolaInstance,
): Promise<void> {
  if (import.meta.client) {
    logger.debug('[response] skipping headers validation on CSR')
    return
  }

  const config = app.$config.public.sanctum as PublicModuleOptions
  const headers = ctx.response?.headers

  if (!headers) {
    logger.warn('[response] no headers returned from API')
    return
  }

  for (const validator of validators) {
    validator(headers, config, logger)
  }
}
