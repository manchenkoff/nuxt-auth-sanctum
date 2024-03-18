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

    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        const configBase = resolver.resolve(nuxt.options.rootDir, options.configFile ?? 'sanctum.config');

        addPlugin(resolver.resolve('./runtime/plugin'));

        addPluginTemplate({
            filename: 'sanctum-config.mjs',
            async getContents() {
                const configPath = await resolver.resolvePath(configBase);
                const configPathExists = existsSync(configBase);

                return `
                    import { defineNuxtPlugin } from '#imports';
                    ${configPathExists ? "import defu from 'defu';" : ''}
                    ${configPathExists ? `import sanctumConfig from '${configPath}'` : ''}

                    export default defineNuxtPlugin((nuxtApp) => {
                        const defaultConfig = {
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
                        };

                        const config = ${configPathExists ? `defu(sanctumConfig, defaultConfig)` : `defaultConfig`};
                        nuxtApp.provide('sanctumConfig', config);
                    });
                `;
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
