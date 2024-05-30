import type {
    SanctumModuleOptions,
    SanctumGlobalMiddlewarePageMeta,
    SanctumAppConfig,
} from './runtime/types';

declare module 'nuxt/schema' {
    interface PublicRuntimeConfig {
        sanctum: Partial<SanctumModuleOptions>;
    }

    interface AppConfig {
        sanctum?: SanctumAppConfig;
    }
}

declare module '#app' {
    interface PageMeta {
        /**
         * @deprecated Use `sanctum.excluded` instead.
         */
        excludeFromSanctum?: boolean;
        /**
         * Sanctum global middleware page configuration.
         */
        sanctum?: Partial<SanctumGlobalMiddlewarePageMeta>;
    }
}

export {};
