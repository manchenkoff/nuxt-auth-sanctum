import type { UseFetchOptions } from 'nuxt/app'
import { useLazyFetch, useSanctumClient } from '#imports'

export function useLazySanctumFetch<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  const client = useSanctumClient()

  return useLazyFetch(url, {
    ...options,
    $fetch: client as typeof $fetch,
  })
}
