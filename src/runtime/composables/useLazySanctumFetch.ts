import type { FetchOptions } from 'ofetch'
import type { DefaultAsyncDataValue } from 'nuxt/app/defaults'
import { assembleFetchRequestKey } from '../utils/fetch'
import { useLazyAsyncData, useSanctumClient } from '#imports'
import type { AsyncData, AsyncDataOptions, KeysOf, PickFrom } from '#app/composables/asyncData'

export function useLazySanctumFetch<ResT, DataE = Error, DataT = ResT, PickKeys extends KeysOf<DataT> = KeysOf<DataT>, DefaultT = DefaultAsyncDataValue>(
  url: string,
  options?: FetchOptions,
  asyncDataOptions?: Omit<AsyncDataOptions<ResT, DataT, PickKeys, DefaultT>, 'lazy'>,
): AsyncData<PickFrom<DataT, PickKeys> | DefaultT, DataE | DefaultAsyncDataValue> {
  const client = useSanctumClient()
  const key = assembleFetchRequestKey(url, true, options)

  return useLazyAsyncData<ResT, DataE, DataT, PickKeys, DefaultT>(
    key,
    () => client<ResT>(url, options as FetchOptions<'json'>),
    asyncDataOptions,
  )
}
