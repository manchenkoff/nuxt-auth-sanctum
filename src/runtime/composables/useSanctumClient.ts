import type { SanctumFetch } from '../types/fetch'
import { useNuxtApp } from '#app'

export const useSanctumClient = (): SanctumFetch => {
  const { $sanctumClient } = useNuxtApp()
  return $sanctumClient as SanctumFetch
}
