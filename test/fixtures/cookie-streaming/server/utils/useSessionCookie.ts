import type { EventHandlerRequest, H3Event } from 'h3'
import { COOKIE_TTL, SESSION_COOKIE_NAME, USER_ID } from '../constants'

export function useSessionCookie(event: H3Event<EventHandlerRequest>) {
  const sessionToken = generateSessionToken(USER_ID)

  setCookie(
    event,
    SESSION_COOKIE_NAME,
    sessionToken,
    {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: COOKIE_TTL,
    },
  )
}

function generateSessionToken(id: number): string {
  return Buffer.from(id.toString()).toString('base64')
}
