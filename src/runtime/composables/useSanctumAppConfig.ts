import { useAppConfig } from '#app';
import type { SanctumAppConfig } from '../types';

export const useSanctumAppConfig = (): SanctumAppConfig => {
    return (useAppConfig().sanctum ?? {}) as SanctumAppConfig;
};
