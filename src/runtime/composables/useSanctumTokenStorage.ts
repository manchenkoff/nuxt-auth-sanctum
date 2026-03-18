import type { TokenStorage } from '../types/config'
import { updateAppConfig } from '#app'

export const useSanctumTokenStorage = (storage: TokenStorage): void => {
  updateAppConfig({
    sanctum: {
      tokenStorage: storage,
    },
  })
}
