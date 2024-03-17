import type { SanctumModuleOptions, SanctumConfigOptions } from './types';
import {
    defineNuxtModule,
    addPlugin,
    createResolver,
    addImportsDir,
    addRouteMiddleware,
} from '@nuxt/kit';
import { addNuxtAuthSanctumConfig } from './config';

export default defineNuxtModule<SanctumModuleOptions>({
    meta: {
        name: 'nuxt-auth-sanctum',
        configKey: 'sanctum',
        compatibility: {
            nuxt: '^3.9.0',
        },
    },

    defaults: {
        configFile: 'sanctum.config.ts',
    },

    setup(options) {
        const resolver = createResolver(import.meta.url);

        addNuxtAuthSanctumConfig(options);

        addImportsDir(resolver.resolve('./runtime/composables'));

        addRouteMiddleware({
            name: 'sanctum:auth',
            path: resolver.resolve('./runtime/middleware/sanctum.auth'),
        });
        addRouteMiddleware({
            name: 'sanctum:guest',
            path: resolver.resolve('./runtime/middleware/sanctum.guest'),
        });

        addPlugin(resolver.resolve('./runtime/plugin'));
    },
});

export const defineNuxtAuthSanctumConfig = (config: Partial<SanctumConfigOptions>) => config;
