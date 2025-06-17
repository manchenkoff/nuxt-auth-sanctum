import type { DefaultAsyncDataErrorValue, DefaultAsyncDataValue } from 'nuxt/app/defaults'
import { assembleFetchRequestKey } from '../utils/fetch'
import type { SanctumFetchOptions } from '../types/fetch'
import { useLazyAsyncData, useSanctumClient } from '#imports'
import type { AsyncData, AsyncDataOptions, KeysOf, PickFrom } from '#app/composables/asyncData'
import type { NuxtError } from '#app'

export function useLazySanctumFetch<ResT, NuxtErrorDataT = unknown, DataT = ResT, PickKeys extends KeysOf<DataT> = KeysOf<DataT>, DefaultT = DefaultAsyncDataValue>(
  url: string,
  options?: SanctumFetchOptions,
  asyncDataOptions?: Omit<AsyncDataOptions<ResT, DataT, PickKeys, DefaultT>, 'lazy'>,
): AsyncData<PickFrom<DataT, PickKeys> | DefaultT, (NuxtErrorDataT extends Error | NuxtError ? NuxtErrorDataT : NuxtError<NuxtErrorDataT>) | DefaultAsyncDataErrorValue> {
  const client = useSanctumClient()
  const key = assembleFetchRequestKey(url, true, options)

  return useLazyAsyncData<ResT, NuxtErrorDataT, DataT, PickKeys, DefaultT>(
    key,
    () => client<ResT>(url, options as SanctumFetchOptions<'json'>),
    asyncDataOptions,
  )
}
