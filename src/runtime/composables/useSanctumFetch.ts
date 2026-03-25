import { useSanctumClient } from '../composables/useSanctumClient'
import type { useFetch } from '#imports'
import { createUseFetch } from '#imports'

export const useSanctumFetch: typeof useFetch = createUseFetch((opts) => {
  opts.$fetch = useSanctumClient() as typeof $fetch

  return opts
})
