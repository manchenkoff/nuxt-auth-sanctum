import type { SanctumConfigOptions } from '../../types';
import { useNuxtApp } from '#app';

export const useSanctumConfig = (): SanctumConfigOptions => {
    const { $sanctumConfig } = useNuxtApp();

    return $sanctumConfig as SanctumConfigOptions;
};
