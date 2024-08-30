import type { SanctumAppConfig } from '../types/config'
import { useAppConfig } from '#app'

export const useSanctumAppConfig = (): SanctumAppConfig => {
  return (useAppConfig().sanctum ?? {}) as SanctumAppConfig
}
