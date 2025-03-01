import type { FetchOptions } from 'ofetch'
import { useLazyAsyncData, useSanctumClient } from '#imports'
import type { AsyncData, KeysOf, PickFrom } from '#app/composables/asyncData'

export function useLazySanctumFetch<T>(
  url: string,
  options?: FetchOptions,
): AsyncData<PickFrom<T, KeysOf<T>> | null | undefined, Error | null | undefined> {
  const client = useSanctumClient()

  return useLazyAsyncData<T>(() => client<T>(url, options as FetchOptions<'json'>))
}
