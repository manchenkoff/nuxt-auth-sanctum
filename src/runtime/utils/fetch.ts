import type { SanctumFetchOptions } from '../types/fetch'

/**
 * Assemble a unique key for the fetch request, required for hydration.
 * @param url The URL to fetch
 * @param lazy Whether the request is lazy or not
 * @param options Optional fetch options
 */
export function assembleFetchRequestKey(
  url: string,
  lazy: boolean,
  options?: SanctumFetchOptions | (() => SanctumFetchOptions),
): string {
  const operation = lazy ? 'lazy-fetch' : 'fetch'
  const resolvedOptions = typeof options == 'function' ? options() : options

  const parts = [
    'sanctum',
    operation,
    url,
    resolvedOptions?.method ?? 'get',
    JSON.stringify({
      query: resolvedOptions?.query ?? {},
      body: resolvedOptions?.body ?? {},
    }),
  ]

  return parts.join(':')
}
