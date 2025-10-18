import { type MaybeRefOrGetter, toRaw, toValue } from 'vue'
import type { SanctumFetchOptions } from '../types/fetch'

/**
 * Assemble a unique key for the fetch request, required for hydration.
 * @param url The URL to fetch
 * @param lazy Whether the request is lazy or not
 * @param options Optional fetch options
 */
export function assembleFetchRequestKey(
  url: MaybeRefOrGetter<string>,
  lazy: boolean,
  options?: MaybeRefOrGetter<SanctumFetchOptions>,
): string {
  const
    operation = lazy ? 'lazy-fetch' : 'fetch',
    resolvedUrl = toRaw(toValue(url)),
    resolvedOptions = toRaw(toValue(options))

  const parts = [
    'sanctum',
    operation,
    resolvedUrl,
    resolvedOptions?.method ?? 'get',
    JSON.stringify({
      query: resolvedOptions?.query ?? {},
      body: resolvedOptions?.body ?? {},
    }),
  ]

  return parts.join(':')
}
