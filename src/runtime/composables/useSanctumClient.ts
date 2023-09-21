import { useNuxtApp } from '#app';

export const useSanctumClient = () => {
    const { $sanctumClient } = useNuxtApp();

    return $sanctumClient;
};
