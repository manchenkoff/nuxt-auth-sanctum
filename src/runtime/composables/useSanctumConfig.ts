import type { SanctumConfigOptions } from '../../types';
import { useNuxtApp } from '#app';

export const useSanctumConfig = () => {
    const { $sanctumConfig } = useNuxtApp();

    return $sanctumConfig as Readonly<Required<SanctumConfigOptions>>;
};
