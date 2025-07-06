import type { PublicModuleOptions } from '../types/options'
import { useRuntimeConfig } from '#imports'

export const useSanctumConfig = (): PublicModuleOptions => {
  return useRuntimeConfig().public.sanctum as PublicModuleOptions
}
