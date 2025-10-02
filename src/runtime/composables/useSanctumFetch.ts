import { assembleFetchRequestKey } from '../utils/fetch'
import type { SanctumFetchOptions } from '../types/fetch'
import { useAsyncData, useSanctumClient } from '#imports'
import type { AsyncData, AsyncDataOptions, KeysOf, PickFrom } from '#app/composables/asyncData'
import type { NuxtError } from '#app'

export function useSanctumFetch<ResT, NuxtErrorDataT = unknown, DataT = ResT, PickKeys extends KeysOf<DataT> = KeysOf<DataT>, DefaultT = undefined>(
  url: string,
  options?: SanctumFetchOptions | (() => SanctumFetchOptions),
  asyncDataOptions?: AsyncDataOptions<ResT, DataT, PickKeys, DefaultT>,
  key?: string,
): AsyncData<PickFrom<DataT, PickKeys> | DefaultT, (NuxtErrorDataT extends Error | NuxtError ? NuxtErrorDataT : NuxtError<NuxtErrorDataT>) | undefined> {
  const client = useSanctumClient()
  const fetchKey = key ?? assembleFetchRequestKey(url, false, options)

  return useAsyncData<ResT, NuxtErrorDataT, DataT, PickKeys, DefaultT>(
    fetchKey,
    () => {
      const clientOptions = typeof options == 'function' ? options() : options
      return client<ResT>(url, clientOptions as SanctumFetchOptions<'json'>)
    },
    asyncDataOptions,
  )
}
