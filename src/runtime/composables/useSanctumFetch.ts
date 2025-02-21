import type { UseFetchOptions } from 'nuxt/app'
import type { FetchError } from 'ofetch'
import { useFetch, useSanctumClient } from '#imports'
import type { AsyncData, KeysOf, PickFrom } from '#app/composables/asyncData'

type FetchResponse<T> = AsyncData<PickFrom<T, KeysOf<T>> | null, FetchError | null | undefined>

export function useSanctumFetch<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
): FetchResponse<T> {
  const client = useSanctumClient()

  return useFetch(url, {
    ...options,
    $fetch: client as typeof $fetch,
  }) as FetchResponse<T>
}
