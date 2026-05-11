import type { EventHandlerRequest, H3Event } from 'h3'
import { useCsrfValidation } from '../utils/useCsrfValidation'
import { useSanctumConfig } from '../utils/useSanctumConfig'
import { SESSION_COOKIE_NAME } from '../constants'
import { useAuth } from '../utils/useAuth'

export default defineEventHandler((event: H3Event<EventHandlerRequest>) => {
  useCsrfValidation(event)
  useAuth(event)

  const sanctumConfig = useSanctumConfig()

  deleteCookie(event, sanctumConfig.csrf.cookie!, { path: '/' })
  deleteCookie(event, SESSION_COOKIE_NAME, { path: '/' })

  setResponseStatus(event, 204)

  return null
})
