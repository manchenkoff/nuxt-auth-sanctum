// 'access-control-allow-credentials': 'true',
// 'access-control-allow-origin': 'http://localhost:3000',
// 'content-type': 'application/json',
// 'set-cookie': 'XSRF-TOKEN=eyJpdiI6IjBaallkZjcxOXdSZFFHa3FEL3lGYlE9PSIsInZhbHVlIjoiN3dXQTlOV2QyVnMzQ1FZWHU0MDNHSVBPbnJSbjl2VFpMN3V2R3lPU2pEUGk0TytORVdneHE2bmZRVnZGMkhJdDRCL1JVR0xWcE1lTFZRQTZObCtRd3V0RFY2UVREOEFNSU5UZzQ5YjVnbERqOEpwN0RDN3FwSWFMMGJ6Sm9sV08iLCJtYWMiOiI3Y2Q1YzkyNTRkMWNhYmVhMzA5MGM2MmQzMWU3NmRiMjFkNzNlOWNhYzBmOTdjNzZlNThkM2UwMGE1YmE0NzRhIiwidGFnIjoiIn0%3D; expires=Tue, 01 Oct 2024 22:13:33 GMT; Max-Age=7200; path=/; samesite=lax, laravel_session=eyJpdiI6Ik5WSktXZzhhaExSYi9wYS9KUU95UFE9PSIsInZhbHVlIjoiWnVZdEVwSUNhWHBGTVBMNHhtbllwa2ljTHdoL2xJSWhxS1JOTkpOcGdyS0RPREx0S2xkZHlGYUZXcFM2ZEN4akxMWGtLWjVWUkUxWVV5cG0zWWFrWnY5QTBZdUVTTGlzSkhwYTNmTzdWdThPYkpNcUJoQTN4NnZ3eVJGSG9wY2ciLCJtYWMiOiIyNjhlNzYyNDM1OTg3NDBiM2NjMDU0YWQ0N2Y3MDk1Njg2ZjgxNTM0Yzk0YjhkOWJmOGVjNjM3MzY0Mjc2ZDY2IiwidGFnIjoiIn0%3D; expires=Tue, 01 Oct 2024 22:13:33 GMT; Max-Age=7200; path=/; httponly; samesite=lax',

import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import type { ModuleOptions } from '../../types/options'
import { type NuxtApp, useRequestURL } from '#app'

type HeaderValidator = (headers: Headers, config: ModuleOptions, logger: ConsolaInstance) => void

const validateCookieHeader: HeaderValidator = (
  headers: Headers,
  config: ModuleOptions,
  logger: ConsolaInstance,
): void => {
  if (config.mode == 'token') {
    return
  }

  if (!headers.has('set-cookie')) {
    logger.warn('[response] `set-cookie` header is missing')
  }
}

const validateContentTypeHeader: HeaderValidator = (
  headers: Headers,
  config: ModuleOptions,
  logger: ConsolaInstance,
): void => {
  const contentType = headers.get('content-type')

  if (!contentType || !contentType.includes('application/json')) {
    logger.warn('[response] `content-type` header is missing or invalid')
  }
}

const validateCredentialsHeader: HeaderValidator = (
  headers: Headers,
  config: ModuleOptions,
  logger: ConsolaInstance,
): void => {
  if (config.mode == 'token') {
    return
  }

  const allowCredentials = headers.get('access-control-allow-credentials')

  if (!allowCredentials || allowCredentials !== 'true') {
    logger.warn('[response] `access-control-allow-credentials` header is missing or invalid')
  }
}

const validateOriginHeader: HeaderValidator = (
  headers: Headers,
  config: ModuleOptions,
  logger: ConsolaInstance,
): void => {
  const allowOrigin = headers.get('access-control-allow-origin')
  const currentOrigin = config?.origin ?? useRequestURL().origin

  if (!allowOrigin || !allowOrigin.includes(currentOrigin)) {
    logger.warn('[response] `access-control-allow-origin` header is missing or invalid')
  }
}

const validators: HeaderValidator[] = [
  validateCookieHeader,
  validateContentTypeHeader,
  validateCredentialsHeader,
  validateOriginHeader,
]

export default async function validateResponseHeaders(
  app: NuxtApp,
  ctx: FetchContext,
  logger: ConsolaInstance,
): Promise<void> {
  if (import.meta.client) {
    logger.debug('[response] skipping headers validation on CSR')
    return
  }

  const config = app.$config.public.sanctum as ModuleOptions
  const headers = ctx.response?.headers

  if (!headers) {
    logger.warn('[response] no headers returned from API')
    return
  }

  for (const validator of validators) {
    validator(headers, config, logger)
  }
}
