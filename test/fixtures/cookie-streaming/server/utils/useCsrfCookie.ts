import type { EventHandlerRequest, H3Event } from 'h3'
import { useSanctumConfig } from '../utils/useSanctumConfig'
import { COOKIE_TTL } from '../constants'

export function useCsrfCookie(event: H3Event<EventHandlerRequest>) {
  const csrfToken = generateRandomToken()
  const sanctumConfig = useSanctumConfig()

  setCookie(
    event,
    sanctumConfig.csrf.cookie!,
    csrfToken,
    {
      httpOnly: false,
      path: '/',
      sameSite: 'lax',
      maxAge: COOKIE_TTL,
    },
  )
}

function generateRandomToken(): string {
  return Array
    .from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
