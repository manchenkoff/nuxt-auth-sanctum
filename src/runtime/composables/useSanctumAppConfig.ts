import type { SanctumAppConfig } from '../types/config'
import { useAppConfig } from '#imports'

export const useSanctumAppConfig = (): SanctumAppConfig => {
  return (useAppConfig().sanctum ?? {}) as SanctumAppConfig
}
