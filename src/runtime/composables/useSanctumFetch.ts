import type { FetchOptions } from 'ofetch'
import { useAsyncData, useSanctumClient } from '#imports'
import type { AsyncData, KeysOf, PickFrom } from '#app/composables/asyncData'

export function useSanctumFetch<T>(
  url: string,
  options?: FetchOptions,
): AsyncData<PickFrom<T, KeysOf<T>> | null | undefined, Error | null | undefined> {
  const client = useSanctumClient()

  const keyParts = [
    'sanctum',
    'fetch',
    url,
    options?.method ?? 'get',
    JSON.stringify({
      query: options?.query ?? {},
      body: options?.body ?? {},
    }),
  ]

  const key = keyParts.join(':')

  console.log(key)

  return useAsyncData<T>(key, () => client<T>(url, options as FetchOptions<'json'>))
}
