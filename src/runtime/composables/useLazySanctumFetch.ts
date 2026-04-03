import { type UseFetchOptions, useLazyFetch } from '#app'
import { toRaw, toValue, type MaybeRefOrGetter } from 'vue'
import { useSanctumClient } from '../composables/useSanctumClient'
import type { SanctumFetchResponse } from '../types/fetch'

export function useLazySanctumFetch<T>(
  url: MaybeRefOrGetter<string>,
  options?: Omit<UseFetchOptions<T>, 'lazy'>,
): SanctumFetchResponse<T> {
  const client = useSanctumClient() as typeof $fetch
  const key = options?.key ?? JSON.stringify([toRaw(toValue(url)), toRaw(toValue(options))])

  const params = { ...options, key, $fetch: client } as UseFetchOptions<T>

  // @ts-expect-error unable to satisfy params<T>
  return useLazyFetch<T>(url, params)
}
