import { useState, useRuntimeConfig } from '#app';

export const useSanctumUser = <T>() => {
    const config = useRuntimeConfig();

    const user = useState<T | null>(
        config.public.sanctum.userStateKey,
        () => null
    );

    return user;
};
