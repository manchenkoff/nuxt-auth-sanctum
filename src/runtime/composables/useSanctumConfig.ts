import type { PublicModuleOptions, ModuleOptions } from '../types/options'
import { useRuntimeConfig } from '#imports'

export const useSanctumConfig = (): PublicModuleOptions | ModuleOptions => {
  const config = useRuntimeConfig()

  if (import.meta.server) {
    return config.sanctum as ModuleOptions
  }

  return config.public.sanctum as PublicModuleOptions
}
