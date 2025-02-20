import type { UseFetchOptions } from 'nuxt/app'
import { useFetch, useSanctumClient } from '#imports'

export function useSanctumFetch<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  const client = useSanctumClient()

  return useFetch(url, {
    ...options,
    $fetch: client as typeof $fetch,
  })
}
