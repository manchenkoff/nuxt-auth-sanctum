import type { EventHandlerRequest, H3Event } from 'h3'
import { useCsrfCookie } from '../utils/useCsrfCookie'

export default defineEventHandler((event: H3Event<EventHandlerRequest>) => {
  useCsrfCookie(event)

  setResponseStatus(event, 204)

  return null
})
