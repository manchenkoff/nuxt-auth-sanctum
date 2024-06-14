import {
    defineNuxtModule,
    addPlugin,
    createResolver,
    addImportsDir,
    addRouteMiddleware,
    useLogger,
} from '@nuxt/kit';
import { defu } from 'defu';
import { defaultModuleOptions } from './config';
import type { SanctumGlobalMiddlewarePageMeta } from './runtime/types/meta';
import type { SanctumModuleOptions } from './runtime/types/options';
import { registerTypeTemplates } from './templates';

type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

declare module '#app' {
    interface PageMeta {
        /**
         * Sanctum global middleware page configuration.
         */
        sanctum?: Partial<SanctumGlobalMiddlewarePageMeta>;
    }
}

const MODULE_NAME = 'nuxt-auth-sanctum';

export type ModuleOptions = DeepPartial<SanctumModuleOptions>;
export type ModulePublicRuntimeConfig = { sanctum: ModuleOptions };

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: MODULE_NAME,
        configKey: 'sanctum',
        compatibility: {
            nuxt: '>=3.9.0',
        },
    },

    defaults: defaultModuleOptions,

    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        const runtimeDir = resolver.resolve('./runtime');
        nuxt.options.build.transpile.push(runtimeDir);

        const sanctumConfig = defu(
            nuxt.options.runtimeConfig.public.sanctum as any,
            options
        );

        nuxt.options.runtimeConfig.public.sanctum = sanctumConfig;

        const logger = useLogger(MODULE_NAME, {
            level: sanctumConfig.logLevel,
        });

        addPlugin(resolver.resolve('./runtime/plugin'));
        addImportsDir(resolver.resolve('./runtime/composables'));

        if (sanctumConfig.globalMiddleware.enabled) {
            addRouteMiddleware({
                name: 'sanctum:auth:global',
                path: resolver.resolve('./runtime/middleware/sanctum.global'),
                global: true,
            });

            logger.info('Sanctum module initialized with global middleware');
        } else {
            addRouteMiddleware({
                name: 'sanctum:auth',
                path: resolver.resolve('./runtime/middleware/sanctum.auth'),
            });
            addRouteMiddleware({
                name: 'sanctum:guest',
                path: resolver.resolve('./runtime/middleware/sanctum.guest'),
            });

            logger.info('Sanctum module initialized w/o global middleware');
        }

        registerTypeTemplates(resolver);
    },
});
