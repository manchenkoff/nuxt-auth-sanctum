import { useSanctumClient } from '../composables/useSanctumClient'
import { createUseFetch, type useFetch } from '#imports'

export const useSanctumFetch: typeof useFetch = createUseFetch((opts) => {
  opts.$fetch = useSanctumClient() as typeof $fetch

  return opts
})
