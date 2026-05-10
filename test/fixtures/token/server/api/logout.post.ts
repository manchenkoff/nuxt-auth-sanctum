import type { EventHandlerRequest, H3Event } from 'h3'
import { useAuth } from '../utils/useAuth'

export default defineEventHandler((event: H3Event<EventHandlerRequest>) => {
  useAuth(event)

  setResponseStatus(event, 204)

  return null
})
