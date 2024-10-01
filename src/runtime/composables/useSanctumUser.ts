import type { Ref } from 'vue'
import { useSanctumConfig } from './useSanctumConfig'
import { useState } from '#app'

/**
 * Returns a current authenticated user information.
 * @returns Reference to the user state as T.
 */
export const useSanctumUser = <T>(): Ref<T | null> => {
  const options = useSanctumConfig()
  return useState<T | null>(options.userStateKey, () => null)
}
