import { getRequestURL, type H3Event, appendResponseHeaders, defineEventHandler } from 'h3'

export default defineEventHandler((event: H3Event) => {
  const { protocol } = getRequestURL(event)

  appendResponseHeaders(event, {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': `${protocol}//127.0.0.1:51000`,
    'set-cookie': 'XSRF-TOKEN=csrf-cookie; path=/; secure; samesite=lax; httponly',
  })

  return {
    id: 1,
    name: 'John Doe',
  }
})
