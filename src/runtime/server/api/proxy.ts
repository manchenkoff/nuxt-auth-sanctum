import type { EventHandlerRequest, H3Event, HTTPMethod, RequestHeaders } from 'h3'
import {
  appendResponseHeader,
  defineEventHandler,
  getQuery,
  getRequestHeader,
  getRequestHeaders,
  readBody,
  setResponseStatus,
} from 'h3'
import { $fetch, type FetchContext, type FetchResponse } from 'ofetch'
import { useSanctumLogger } from '../../utils/logging'
import { determineCredentialsMode } from '../../utils/credentials'
import { trimTrailingSlash } from '../utils/formatter'
import type { ModuleOptions } from '../../types/options'
import { useRuntimeConfig } from '#imports'
import type { ConsolaInstance } from 'consola'
import { useNitroApp } from 'nitropack/runtime'

const METHODS_WITH_BODY: HTTPMethod[] = ['POST', 'PUT', 'PATCH', 'DELETE']

const REQUEST_HEADERS_TO_IGNORE = [
  'connection',
  'upgrade',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'host',
  'content-length',
  'accept-encoding',
]

const RESPONSE_HEADERS_TO_IGNORE = [
  ...REQUEST_HEADERS_TO_IGNORE,
  'content-encoding',
]

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  const config = useRuntimeConfig().sanctum as ModuleOptions
  const logger = useSanctumLogger(config.logLevel)

  const endpoint = assembleEndpoint(event, config.serverProxy.baseUrl)

  logger.debug(`[sanctum] proxying request to ${endpoint}`)

  const response = await proxyRequest(event, endpoint, logger)

  prepareResponse(event, response)

  logger.debug(`[sanctum] proxying response from ${endpoint}`)

  return response._data
})

function assembleEndpoint(event: H3Event<EventHandlerRequest>, baseUrl: string): string {
  const
    base = trimTrailingSlash(baseUrl),
    path = trimTrailingSlash(event.context.params?._ || '')

  if (!base) {
    throw new Error('[sanctum] serverProxy.baseUrl is not configured')
  }

  if (path.length === 0) {
    return base
  }

  return `${base}/${path}`
}

function dropProxyHeaders(headers: RequestHeaders): RequestHeaders {
  const filteredHeaders = Object
    .entries(headers)
    .filter(([name]) => !REQUEST_HEADERS_TO_IGNORE.includes(name.toLowerCase()))

  return Object.fromEntries(filteredHeaders)
}

async function proxyRequest(event: H3Event<EventHandlerRequest>, endpoint: string, logger: ConsolaInstance): Promise<FetchResponse<unknown>> {
  const nitroApp = useNitroApp()

  const
    method = event.method,
    query = getQuery(event),
    body = await getBody(event),
    headers = {
      accept: 'application/json',
      ...dropProxyHeaders(getRequestHeaders(event)),
    }

  return await $fetch.raw(endpoint, {
    method: method,
    query: query,
    body: body,
    credentials: determineCredentialsMode(),
    headers: headers,
    ignoreResponseError: true,
    async onRequest(context: FetchContext): Promise<void> {
      await nitroApp.hooks.callHook('sanctum:proxy:request', context, logger)
    },
  })
}

async function getBody(event: H3Event<EventHandlerRequest>) {
  if (!METHODS_WITH_BODY.includes(event.method)) {
    return Promise.resolve(undefined)
  }

  const contentLength = getRequestHeader(event, 'content-length')

  if (!contentLength || contentLength === '0') {
    return Promise.resolve(undefined)
  }

  const contentType = getRequestHeader(event, 'content-type')

  if (contentType?.includes('multipart/form-data')) {
    return Promise.resolve(event.node.req)
  }

  return readBody(event)
}

function prepareResponse(event: H3Event<EventHandlerRequest>, response: FetchResponse<unknown>): void {
  response.headers.forEach((value, key) => {
    if (RESPONSE_HEADERS_TO_IGNORE.includes(key.toLowerCase())) {
      return
    }

    appendResponseHeader(event, key, value)
  })

  setResponseStatus(event, response.status)
}
