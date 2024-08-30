import type { ModuleOptions } from '../types/options'
import { useRuntimeConfig } from '#app'

export const useSanctumConfig = (): ModuleOptions => {
  return useRuntimeConfig().public.sanctum as ModuleOptions
}
