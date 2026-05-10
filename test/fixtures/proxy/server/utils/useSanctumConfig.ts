import type { ModuleOptions } from '../../../../../src/runtime/types/options'

export function useSanctumConfig(): ModuleOptions {
  const runtimeConfig = useRuntimeConfig()

  return runtimeConfig.sanctum as ModuleOptions
}
