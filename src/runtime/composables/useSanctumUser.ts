import { useState, useRuntimeConfig } from '#app';
import { type Ref } from 'vue';
import { SanctumModuleOptions } from '~/src/types';

/**
 * Returns a current authenticated user information.
 * @returns Reference to the user state as T.
 */
export const useSanctumUser = <T>(): Ref<T | null> => {
    const options = useRuntimeConfig().public.sanctum as SanctumModuleOptions;

    const user = useState<T | null>(options.userStateKey, () => null);

    return user;
};
