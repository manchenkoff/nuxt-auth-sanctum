import { useState, useRuntimeConfig } from '#app';
import { SanctumOptions } from '~/src/types';

export const useSanctumUser = <T>() => {
    const options = useRuntimeConfig().public.sanctum as SanctumOptions;

    const user = useState<T | null>(options.userStateKey, () => null);

    return user;
};
