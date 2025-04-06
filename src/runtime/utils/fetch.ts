import type { FetchOptions } from 'ofetch'

/**
 * Assemble a unique key for the fetch request, required for hydration.
 * @param url The URL to fetch
 * @param lazy Whether the request is lazy or not
 * @param options Optional fetch options
 */
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
