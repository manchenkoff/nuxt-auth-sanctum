import type { FetchOptions } from 'ofetch'

export function assembleFetchRequestKey(
  url: string,
  lazy: boolean,
  options?: FetchOptions,
): string {
  const operation = lazy ? 'lazy-fetch' : 'fetch'

  const parts = [
    'sanctum',
    operation,
    url,
    options?.method ?? 'get',
    JSON.stringify({
      query: options?.query ?? {},
      body: options?.body ?? {},
    }),
  ]

  return parts.join(':')
}
