import type { MappedResponseType, FetchRequest, Fetch, FetchOptions, FetchResponse, ResponseType, $Fetch, FetchError } from 'ofetch'
import type { AsyncData, KeysOf, PickFrom } from '#app/composables/asyncData'

export type SanctumFetchOptions<R extends ResponseType = ResponseType, T = unknown> = Omit<
  FetchOptions<R, T>,
  'baseUrl'
  | 'credentials'
  | 'redirect'
  | 'retry'
  | 'onRequest'
  | 'onRequestError'
  | 'onResponse'
  | 'onResponseError'
>

export interface SanctumFetch extends $Fetch {
  <T = unknown, R extends ResponseType = 'json'>(request: FetchRequest, options?: SanctumFetchOptions<R>): Promise<MappedResponseType<R, T>>
  raw<T = unknown, R extends ResponseType = 'json'>(request: FetchRequest, options?: SanctumFetchOptions<R>): Promise<FetchResponse<MappedResponseType<R, T>>>
  native: Fetch
}

export type SanctumFetchResponse<T> = AsyncData<PickFrom<T, KeysOf<T>> | undefined, FetchError | undefined>
