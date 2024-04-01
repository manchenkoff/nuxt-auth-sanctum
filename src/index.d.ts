import { SanctumModuleOptions } from './types';

declare module 'nuxt/schema' {
    interface PublicRuntimeConfig {
        sanctum: Partial<SanctumModuleOptions>;
    }
}

declare module '#app' {
    interface PageMeta {
        excludeFromSanctum?: boolean;
    }
}
