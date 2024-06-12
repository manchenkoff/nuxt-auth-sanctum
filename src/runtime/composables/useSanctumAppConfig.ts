import { useAppConfig } from '#app';
import type { SanctumAppConfig } from '../types/config';

export const useSanctumAppConfig = (): SanctumAppConfig => {
    return (useAppConfig().sanctum ?? {}) as SanctumAppConfig;
};
