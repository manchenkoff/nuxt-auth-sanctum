import type { FetchOptions } from 'ofetch'
import { useAsyncData, useSanctumClient } from '#imports'
import type { AsyncData, KeysOf, PickFrom } from '#app/composables/asyncData'

export function useSanctumFetch<T>(
  url: string,
  options?: FetchOptions,
): AsyncData<PickFrom<T, KeysOf<T>> | null | undefined, Error | null | undefined> {
  const client = useSanctumClient()

  return useAsyncData<T>(() => client<T>(url, options as FetchOptions<'json'>))
}
