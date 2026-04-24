import type { PublicModuleOptions, ModuleOptions } from '../types/options'
import { useRuntimeConfig } from '#imports'
import { isServerRuntime } from '../utils/runtime'

export const useSanctumConfig = (): PublicModuleOptions | ModuleOptions => {
  const config = useRuntimeConfig()

  if (isServerRuntime()) {
    return config.sanctum as ModuleOptions
  }

  return config.public.sanctum as PublicModuleOptions
}
