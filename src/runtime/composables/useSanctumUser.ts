import { useState } from '#app';
import { type Ref } from 'vue';
import { useSanctumConfig } from './useSanctumConfig';

/**
 * Returns a current authenticated user information.
 * @returns Reference to the user state as T.
 */
export const useSanctumUser = <T>(): Ref<T | null> => {
    const options = useSanctumConfig();
    const user = useState<T | null>(options.userStateKey, () => null);

    return user;
};
