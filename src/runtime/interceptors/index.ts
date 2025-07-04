import type { SanctumInterceptor } from '../types/config'
import { setRequestParams } from './request/params'
import { setStatefulParams } from './request/stateful'
import { setTokenHeader } from './request/token'
import { logRequestHeaders } from './request/logging'
import { proxyResponseHeaders } from './response/proxy'
import { validateResponseHeaders } from './response/validation'
import { logResponseHeaders } from './response/logging'
import { handleResponseError } from './response/errorHandler'

const [request, response, responseError] = [
  [
    setRequestParams,
    setStatefulParams,
    setTokenHeader,
    logRequestHeaders,
  ] as SanctumInterceptor[],
  [
    proxyResponseHeaders,
    validateResponseHeaders,
    logResponseHeaders,
  ] as SanctumInterceptor[],
  [
    handleResponseError,
  ] as SanctumInterceptor[],
]

export const interceptors = {
  request,
  response,
  responseError,
}
