import { describe, expect, it } from 'vitest'
import { extractCookiesFromHeaders } from '../../src/runtime/utils/cookies'

describe('extractCookiesFromHeaders', () => {
  it('returns an empty list when the header is missing', () => {
    expect(extractCookiesFromHeaders(undefined)).toEqual([])
    expect(extractCookiesFromHeaders(new Headers())).toEqual([])
  })

  it('splits multiple cookies without breaking expires dates', () => {
    const cookies = [
      'session=abc123; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Path=/; HttpOnly',
      'XSRF-TOKEN=token; Expires=Thu, 22 Oct 2015 07:28:00 GMT; Path=/',
    ]

    const headers = new Headers()

    for (const cookie of cookies) {
      headers.append('set-cookie', cookie)
    }

    expect(extractCookiesFromHeaders(headers)).toEqual(cookies)
  })
})
