import type { UseFetchOptions } from 'nuxt/app'
import type { FetchError } from 'ofetch'
import { useLazyFetch, useSanctumClient } from '#imports'
import type { KeysOf, PickFrom, AsyncData } from '#app/composables/asyncData'

type LazyFetchResponse<T> = AsyncData<PickFrom<T, KeysOf<T>> | null, FetchError | null | undefined>

export function useLazySanctumFetch<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
): LazyFetchResponse<T> {
  const client = useSanctumClient()

  return useLazyFetch(url, {
    ...options,
    $fetch: client as typeof $fetch,
  }) as LazyFetchResponse<T>
}
