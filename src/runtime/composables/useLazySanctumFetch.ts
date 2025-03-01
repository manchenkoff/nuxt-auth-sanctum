import type { FetchOptions } from 'ofetch'
import { useLazyAsyncData, useSanctumClient } from '#imports'
import type { AsyncData, KeysOf, PickFrom } from '#app/composables/asyncData'

export function useLazySanctumFetch<T>(
  url: string,
  options?: FetchOptions,
): AsyncData<PickFrom<T, KeysOf<T>> | null | undefined, Error | null | undefined> {
  const client = useSanctumClient()

  const keyParts = [
    'sanctum',
    'lazy-fetch',
    url,
    options?.method ?? 'get',
    JSON.stringify({
      query: options?.query ?? {},
      body: options?.body ?? {},
    }),
  ]

  const key = keyParts.join(':')

  return useLazyAsyncData<T>(key, () => client<T>(url, options as FetchOptions<'json'>))
}
