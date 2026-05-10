import type { H3Event, EventHandlerRequest } from 'h3'

export default defineEventHandler((event: H3Event<EventHandlerRequest>) => {
  const
    origin = getRequestHeader(event, 'origin'),
    referrer = getRequestHeader(event, 'referer')

  const header = origin || referrer

  if (!header) {
    return
  }

  const value = new URL(header).origin

  setResponseHeader(event, 'Access-Control-Allow-Origin', value)
  setResponseHeader(event, 'Access-Control-Allow-Credentials', 'true')
})
