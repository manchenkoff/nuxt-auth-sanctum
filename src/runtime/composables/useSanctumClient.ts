import type { $Fetch } from 'ofetch'
import { useNuxtApp } from '#app'

export const useSanctumClient = (): $Fetch => {
  const { $sanctumClient } = useNuxtApp()

  return $sanctumClient as $Fetch
}
