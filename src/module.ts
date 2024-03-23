import { existsSync } from 'node:fs';
import type { SanctumModuleOptions } from './types';
import {
    defineNuxtModule,
    addPlugin,
    createResolver,
    addImportsDir,
    addRouteMiddleware,
    addPluginTemplate,
} from '@nuxt/kit';
import defu from 'defu';

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

        addPlugin(resolver.resolve('./runtime/plugin'));

        addPluginTemplate({
            filename: 'sanctum-plugin.mjs',
            async getContents() {
                const configPath = await resolver.resolvePath(resolver.resolve(
                    nuxt.options.rootDir,
                    'sanctum.config'
                ));
                const configPathExists = existsSync(configPath);

                return `
                    import { defineNuxtPlugin } from '#imports';
                    ${configPathExists ? "import defu from 'defu';" : ''}
                    ${configPathExists ? `import sanctumConfig from '${configPath}';` : ''}

                    export default defineNuxtPlugin((nuxtApp) => {
                        const defaultConfig = ${JSON.stringify(defu(nuxt.options.runtimeConfig.public.sanctum, options))};
                        const config = ${configPathExists ? `defu(typeof sanctumConfig === 'function' ? sanctumConfig() : sanctumConfig, defaultConfig)` : `defaultConfig`};
                        nuxtApp.provide('sanctumConfig', config);
                    });
                `
            },
        });

        addImportsDir(resolver.resolve('./runtime/composables'));

        addRouteMiddleware({
            name: 'sanctum:auth',
            path: resolver.resolve('./runtime/middleware/sanctum.auth'),
        });
        addRouteMiddleware({
            name: 'sanctum:guest',
            path: resolver.resolve('./runtime/middleware/sanctum.guest'),
        });
    },
});
