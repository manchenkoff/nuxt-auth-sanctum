import type { EventHandlerRequest, H3Event } from 'h3'
import { useAuth } from '../utils/useAuth'
import { USER_EMAIL, USER_ID, USER_NAME } from '../constants'

export default defineEventHandler((event: H3Event<EventHandlerRequest>) => {
  useAuth(event)

  return {
    id: USER_ID,
    name: USER_NAME,
    email: USER_EMAIL,
  }
})
