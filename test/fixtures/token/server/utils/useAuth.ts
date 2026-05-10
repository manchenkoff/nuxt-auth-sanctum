import type { H3Event, EventHandlerRequest } from 'h3'

export function useAuth(event: H3Event<EventHandlerRequest>) {
  const token = getHeader(event, 'Authorization')

  if (!token || !token.startsWith('Bearer')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
}
