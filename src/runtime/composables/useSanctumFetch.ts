import { assembleFetchRequestKey } from '../utils/fetch'
import type { SanctumFetchOptions } from '../types/fetch'
import { type MaybeRefOrGetter, toValue } from 'vue'
import { useAsyncData, useSanctumClient } from '#imports'
import type { AsyncData, AsyncDataOptions, KeysOf, PickFrom } from '#app/composables/asyncData'
import type { NuxtError } from '#app'

export function useSanctumFetch<ResT, NuxtErrorDataT = unknown, DataT = ResT, PickKeys extends KeysOf<DataT> = KeysOf<DataT>, DefaultT = undefined>(
  url: MaybeRefOrGetter<string>,
  options?: MaybeRefOrGetter<SanctumFetchOptions>,
  asyncDataOptions?: AsyncDataOptions<ResT, DataT, PickKeys, DefaultT>,
  key?: MaybeRefOrGetter<string>,
): AsyncData<PickFrom<DataT, PickKeys> | DefaultT, (NuxtErrorDataT extends Error | NuxtError ? NuxtErrorDataT : NuxtError<NuxtErrorDataT>) | undefined> {
  const client = useSanctumClient()
  const fetchKey = key ?? assembleFetchRequestKey(url, false, options)

  return useAsyncData<ResT, NuxtErrorDataT, DataT, PickKeys, DefaultT>(
    fetchKey,
    () => {
      const
        resolvedUrl = toValue(url),
        resolvedOptions = toValue(options)

      return client<ResT>(
        resolvedUrl,
        resolvedOptions as SanctumFetchOptions<'json'>,
      )
    },
    asyncDataOptions,
  )
}
