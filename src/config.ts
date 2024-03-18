import type { SanctumModuleOptions } from './types';
import { createResolver, useNuxt, addPluginTemplate } from '@nuxt/kit';

export function addNuxtAuthSanctumConfig(options: SanctumModuleOptions) {
    const resolver = createResolver(import.meta.url);
    const nuxt = useNuxt();

    const configPath = resolver.resolve(nuxt.options.rootDir, options.configFile ?? 'sanctum.config');

    addPluginTemplate({
        filename: 'nuxt-auth-sanctum-config.mjs',
        getContents() {
            return `
                import { defineNuxtPlugin } from '#imports';
                ${configPath ? "import defu from 'defu';" : ''};
                ${configPath ? `import sanctumConfig from '${configPath}';` : ''};

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

                    const config = ${configPath ? "defu(sanctumConfig, defaultConfig)" : 'defaultConfig'};

                    return {
                        provide: {
                            sanctumConfig: config,
                        },
                    };
                });
            `;
        },
    });
};
