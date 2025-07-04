import {
  type H3Event,
  type EventHandlerRequest,
  type HTTPMethod,
  appendResponseHeader,
} from 'h3'
import { defineEventHandler, getRequestHeaders, readBody, getQuery, setResponseStatus } from 'h3'
import { $fetch } from 'ofetch'
import { useSanctumConfig } from '../../composables/useSanctumConfig'
import { useSanctumLogger } from '../../utils/logging'
import { determineCredentialsMode } from '../../utils/credentials'

const METHODS_WITH_BODY: HTTPMethod[] = ['POST', 'PUT', 'PATCH', 'DELETE']
const HEADERS_TO_IGNORE = ['content-length', 'content-encoding', 'transfer-encoding']

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  const config = useSanctumConfig()
  const logger = useSanctumLogger(config.logLevel)

  const
    method = event.method,
    query = getQuery(event),
    body = METHODS_WITH_BODY.includes(method) ? await readBody(event) : undefined,
    headers = getRequestHeaders(event),
    proxyRoute = event.context.params?._

  const targetUrl = `${config.serverProxy.baseUrl}/${proxyRoute}`

  logger.debug(`[sanctum] proxying request to ${targetUrl}`)

  const response = await $fetch.raw(targetUrl, {
    method: method,
    query: query,
    body: body,
    credentials: determineCredentialsMode(),
    headers: {
      accept: 'application/json',
      ...headers,
    } as HeadersInit,
    ignoreResponseError: true,
  })

  response.headers.forEach((value, key) => {
    if (HEADERS_TO_IGNORE.includes(key.toLowerCase())) {
      return
    }

    appendResponseHeader(event, key, value)
  })

  setResponseStatus(event, response.status)

  logger.debug(`[sanctum] proxying response from ${targetUrl}`)

  return response._data
})
