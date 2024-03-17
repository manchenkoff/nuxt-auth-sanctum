import { SanctumModuleOptions } from './types';

declare module 'nuxt/schema' {
    interface PublicRuntimeConfig {
        sanctum: SanctumModuleOptions;
    }
}
