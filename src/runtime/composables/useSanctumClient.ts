import { useNuxtApp } from '#app';
import type { $Fetch } from 'ofetch';

export const useSanctumClient = (): $Fetch => {
    const { $sanctumClient } = useNuxtApp();

    return $sanctumClient as $Fetch;
};
