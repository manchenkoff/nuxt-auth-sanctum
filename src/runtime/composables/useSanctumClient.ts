import { useNuxtApp } from '#app'

export const useSanctumClient = (): typeof $fetch => {
  const { $sanctumClient } = useNuxtApp()
  return $sanctumClient
}
