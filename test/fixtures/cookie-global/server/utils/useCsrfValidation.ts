import type { H3Event, EventHandlerRequest } from 'h3'
import { useSanctumConfig } from './useSanctumConfig'

export function useCsrfValidation(event: H3Event<EventHandlerRequest>) {
  const sanctumConfig = useSanctumConfig()

  const csrfToken = getRequestHeader(event, sanctumConfig.csrf.header!)
  const csrfCookie = getCookie(event, sanctumConfig.csrf.cookie!)

  if (csrfToken !== csrfCookie) {
    throw createError({
      statusCode: 419,
      statusMessage: 'CSRF token mismatch',
    })
  }
}
