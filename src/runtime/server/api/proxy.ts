import { appendResponseHeader, defineEventHandler, getRequestHeader, getRequestHeaders, getQuery, setResponseStatus, readBody } from 'h3'
import type { H3Event, EventHandlerRequest, HTTPMethod } from 'h3'
import { $fetch, type FetchResponse, type FetchContext } from 'ofetch'
import { useSanctumLogger } from '../../utils/logging'
import { determineCredentialsMode } from '../../utils/credentials'
import type { ModuleOptions } from '../../types/options'
import { useRuntimeConfig } from '#imports'
import type { ConsolaInstance } from 'consola'
import { useNitroApp } from 'nitropack/runtime'

const METHODS_WITH_BODY: HTTPMethod[] = ['POST', 'PUT', 'PATCH', 'DELETE']
const HEADERS_TO_IGNORE = ['content-length', 'content-encoding', 'transfer-encoding']

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
  return `${baseUrl}/${event.context.params?._}`
}

async function proxyRequest(event: H3Event<EventHandlerRequest>, endpoint: string, logger: ConsolaInstance): Promise<FetchResponse<unknown>> {
  const nitroApp = useNitroApp()

  const
      method = event.method,
      query = getQuery(event),
      body = await getBody(event),
      headers = {
        accept: 'application/json',
        ...getRequestHeaders(event),
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
    if (HEADERS_TO_IGNORE.includes(key.toLowerCase())) {
      return
    }

    appendResponseHeader(event, key, value)
  })

  setResponseStatus(event, response.status)
}
