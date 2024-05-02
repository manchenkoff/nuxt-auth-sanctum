import {
    defineNuxtModule,
    addPlugin,
    createResolver,
    addImportsDir,
    addRouteMiddleware,
    useLogger,
} from '@nuxt/kit';
import { defu } from 'defu';
import type { SanctumModuleOptions } from './runtime/types';

type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

const LOGGER_NAME = 'nuxt-auth-sanctum';

export default defineNuxtModule<DeepPartial<SanctumModuleOptions>>({
    meta: {
        name: 'nuxt-auth-sanctum',
        configKey: 'sanctum',
        compatibility: {
            nuxt: '^3.9.0',
        },
    },

    defaults: {
        userStateKey: 'sanctum.user.identity',
        redirectIfAuthenticated: false,
        endpoints: {
            csrf: '/sanctum/csrf-cookie',
            login: '/login',
            logout: '/logout',
            user: '/api/user',
        },
        csrf: {
            cookie: 'XSRF-TOKEN',
            header: 'X-XSRF-TOKEN',
        },
        client: {
            retry: false,
        },
        redirect: {
            keepRequestedRoute: false,
            onLogin: '/',
            onLogout: '/',
            onAuthOnly: '/login',
            onGuestOnly: '/',
        },
        globalMiddleware: {
            enabled: false,
            allow404WithoutAuth: true,
        },
        logLevel: 3,
    },

    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        const runtimeConfigOverrides =
            nuxt.options.runtimeConfig.public.sanctum;

        const sanctumConfig = defu(runtimeConfigOverrides as any, options);

        nuxt.options.runtimeConfig.public.sanctum = sanctumConfig;

        const logger = useLogger(LOGGER_NAME, {
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
    },
});
