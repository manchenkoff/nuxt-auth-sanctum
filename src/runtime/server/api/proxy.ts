import { appendResponseHeader, defineEventHandler, getRequestHeaders, getQuery, setResponseStatus } from 'h3'
import type { H3Event, EventHandlerRequest, HTTPMethod } from 'h3'
import { $fetch, type FetchResponse } from 'ofetch'
import { useSanctumLogger } from '../../utils/logging'
import { determineCredentialsMode } from '../../utils/credentials'
import type { ModuleOptions } from '../../types/options'
import { useRuntimeConfig } from '#imports'

const METHODS_WITH_BODY: HTTPMethod[] = ['POST', 'PUT', 'PATCH', 'DELETE']
const HEADERS_TO_IGNORE = ['content-length', 'content-encoding', 'transfer-encoding']

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  const config = useRuntimeConfig().sanctum as ModuleOptions
  const logger = useSanctumLogger(config.logLevel)

  const endpoint = assembleEndpoint(event, config.serverProxy.baseUrl)

  logger.debug(`[sanctum] proxying request to ${endpoint}`)

  const response = await proxyRequest(event, endpoint)

  prepareResponse(event, response)

  logger.debug(`[sanctum] proxying response from ${endpoint}`)

  return response._data
})

function assembleEndpoint(event: H3Event<EventHandlerRequest>, baseUrl: string): string {
  return `${baseUrl}/${event.context.params?._}`
}

function buildHeaders(event: H3Event<EventHandlerRequest>): HeadersInit {
  return {
    accept: 'application/json',
    ...getRequestHeaders(event),
  }
}

async function proxyRequest(event: H3Event<EventHandlerRequest>, endpoint: string): Promise<FetchResponse<unknown>> {
  const
    method = event.method,
    query = getQuery(event),
    body = METHODS_WITH_BODY.includes(method) ? event.node.req : undefined,
    headers = buildHeaders(event)

  return await $fetch.raw(endpoint, {
    method: method,
    query: query,
    body: body,
    credentials: determineCredentialsMode(),
    headers: headers,
    ignoreResponseError: true,
  })
}

function prepareResponse(event: H3Event<EventHandlerRequest>, response: FetchResponse<unknown>): void {
  response.headers.forEach((value, key) => {
    if (HEADERS_TO_IGNORE.includes(key.toLowerCase())) {
      return
    }

    appendResponseHeader(event, key, value)
  })

  setResponseStatus(event, response.status)
}
