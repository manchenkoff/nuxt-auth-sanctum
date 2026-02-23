import type { EventHandlerRequest, H3Event, HTTPMethod } from 'h3'
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
import type { ModuleOptions } from '../../types/options'
import { useRuntimeConfig } from '#imports'
import type { ConsolaInstance } from 'consola'
import { useNitroApp } from 'nitropack/runtime'

const METHODS_WITH_BODY: HTTPMethod[] = ['POST', 'PUT', 'PATCH', 'DELETE']
const HEADERS_TO_IGNORE = ['content-length', 'content-encoding', 'transfer-encoding']

// Hop-by-hop headers dürfen nicht weitergereicht werden (undici wirft sonst UND_ERR_INVALID_ARG)
const HOP_BY_HOP_HEADERS = [
  'connection',
  'upgrade',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
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
  const cleanedBase = (baseUrl || '').replace(/\/+$/, '')
  const cleanedPath = String(event.context.params?._ || '').replace(/^\/+/, '')
  return cleanedBase ? `${cleanedBase}/${cleanedPath}` : `/${cleanedPath}`
}

function sanitizeProxyRequestHeaders(
  rawHeaders: ReturnType<typeof getRequestHeaders>,
): Record<string, string | string[] | undefined> {
  const headers: Record<string, string | string[] | undefined> = { ...rawHeaders }

  for (const key of Object.keys(headers)) {
    const lower = key.toLowerCase()
    if (HOP_BY_HOP_HEADERS.includes(lower)) {
      delete headers[key]
    }
  }

  for (const key of Object.keys(headers)) {
    const lower = key.toLowerCase()
    if (lower === 'host' || lower === 'content-length' || lower === 'accept-encoding') {
      delete headers[key]
    }
  }

  return headers
}

async function proxyRequest(event: H3Event<EventHandlerRequest>, endpoint: string, logger: ConsolaInstance): Promise<FetchResponse<unknown>> {
  const nitroApp = useNitroApp()

  const
    method = event.method,
    query = getQuery(event),
    body = await getBody(event),
    headers = {
      accept: 'application/json',
      ...sanitizeProxyRequestHeaders(getRequestHeaders(event)),
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
    const lower = key.toLowerCase()

    if (HEADERS_TO_IGNORE.includes(lower)) {
      return
    }

    if (HOP_BY_HOP_HEADERS.includes(lower)) {
      return
    }

    appendResponseHeader(event, key, value)
  })

  setResponseStatus(event, response.status)
}
