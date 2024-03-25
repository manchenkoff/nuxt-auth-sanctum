import { useState } from '#app';
import { useSanctumConfig } from './useSanctumConfig';
import { type Ref } from 'vue';

/**
 * Returns a current authenticated user information.
 * @returns Reference to the user state as T.
 */
export const useSanctumUser = <T>(): Ref<T | null> => {
    const config = useSanctumConfig();

    const user = useState<T | null>(config.userStateKey, () => null);

    return user;
};
