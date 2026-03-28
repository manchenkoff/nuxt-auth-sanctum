import { useSanctumClient } from '../composables/useSanctumClient'
import type { useLazyFetch } from '#imports'
import { createUseFetch } from '#imports'

export const useLazySanctumFetch: typeof useLazyFetch = createUseFetch((opts) => {
  opts.$fetch = useSanctumClient() as typeof $fetch
  opts.lazy = true

  return opts
})
