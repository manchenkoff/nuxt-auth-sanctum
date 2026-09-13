import type { H3Event, EventHandlerRequest } from 'h3'
import { SESSION_COOKIE_NAME } from '../constants'

export function useAuth(event: H3Event<EventHandlerRequest>) {
  const sessionCookie = getCookie(event, SESSION_COOKIE_NAME)

  if (!sessionCookie) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
}
