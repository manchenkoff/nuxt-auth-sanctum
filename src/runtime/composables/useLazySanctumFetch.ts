import { assembleFetchRequestKey } from '../utils/fetch'
import type { SanctumFetchOptions } from '../types/fetch'
import type { MaybeRefOrGetter } from 'vue'
import { useLazyAsyncData, useSanctumClient } from '#imports'
import type { AsyncData, AsyncDataOptions, KeysOf, PickFrom } from '#app/composables/asyncData'
import type { NuxtError } from '#app'

export function useLazySanctumFetch<ResT, NuxtErrorDataT = unknown, DataT = ResT, PickKeys extends KeysOf<DataT> = KeysOf<DataT>, DefaultT = undefined>(
  url: string,
  options?: SanctumFetchOptions | (() => SanctumFetchOptions),
  asyncDataOptions?: Omit<AsyncDataOptions<ResT, DataT, PickKeys, DefaultT>, 'lazy'>,
  key?: MaybeRefOrGetter<string>,
): AsyncData<PickFrom<DataT, PickKeys> | DefaultT, (NuxtErrorDataT extends Error | NuxtError ? NuxtErrorDataT : NuxtError<NuxtErrorDataT>) | undefined> {
  const client = useSanctumClient()
  const fetchKey = key ?? assembleFetchRequestKey(url, true, options)

  return useLazyAsyncData<ResT, NuxtErrorDataT, DataT, PickKeys, DefaultT>(
    fetchKey,
    () => {
      const resolvedOptions = typeof options == 'function' ? options() : options
      return client<ResT>(url, resolvedOptions as SanctumFetchOptions<'json'>)
    },
    asyncDataOptions,
  )
}
