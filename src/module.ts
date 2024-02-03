import {
    defineNuxtModule,
    addPlugin,
    createResolver,
    addImportsDir,
    addRouteMiddleware,
} from '@nuxt/kit';
import { defu } from 'defu';
import type { SanctumModuleOptions } from './types';

export default defineNuxtModule<Partial<SanctumModuleOptions>>({
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
    },

    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        const publicConfig = nuxt.options.runtimeConfig.public;
        const userModuleConfig = publicConfig.sanctum;

        nuxt.options.runtimeConfig.public.sanctum = defu(
            userModuleConfig as any,
            options
        );

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
