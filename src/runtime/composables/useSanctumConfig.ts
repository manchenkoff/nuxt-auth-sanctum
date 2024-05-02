import { useRuntimeConfig } from '#app';
import type { SanctumModuleOptions } from '../types';

export const useSanctumConfig = (): SanctumModuleOptions => {
    return useRuntimeConfig().public.sanctum as SanctumModuleOptions;
};
