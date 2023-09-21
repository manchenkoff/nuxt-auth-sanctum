import { SanctumOptions } from './types';

declare module 'nuxt/schema' {
    interface PublicRuntimeConfig {
        sanctum: Partial<SanctumOptions>;
    }
}
