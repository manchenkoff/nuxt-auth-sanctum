import type { ModuleOptions } from '../types/options'
import { useRuntimeConfig } from '#imports'

export const useSanctumConfig = (): ModuleOptions => {
  return useRuntimeConfig().public.sanctum as ModuleOptions
}
