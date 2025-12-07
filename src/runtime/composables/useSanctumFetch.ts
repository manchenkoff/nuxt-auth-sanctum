import { type UseFetchOptions, useFetch } from '#app'
import type { MaybeRefOrGetter } from 'vue'
import { useSanctumClient } from '../composables/useSanctumClient'
import type { SanctumFetchResponse } from '../types/fetch'

export function useSanctumFetch<T>(
  url: MaybeRefOrGetter<string>,
  options?: UseFetchOptions<T>,
): SanctumFetchResponse<T> {
  const client = useSanctumClient() as typeof $fetch
  const params = { ...options, $fetch: client } as UseFetchOptions<T>

  // @ts-expect-error unable to satisfy params<T>
  return useFetch<T>(url, params)
}
