import { existsSync } from 'fs';
import type { SanctumModuleOptions } from './types';
import { createResolver, useNuxt, addPluginTemplate } from '@nuxt/kit';

export function addNuxtAuthSanctumConfig(options: SanctumModuleOptions) {
    const resolver = createResolver(import.meta.url);
    const nuxt = useNuxt();

    const configPath = resolver.resolve(nuxt.options.rootDir, options.configFile ?? 'sanctum.config');
    if (!existsSync(configPath)) throw new Error(
        `Nuxt Auth Sanctum configuration was not located at "${configPath}".`
    );

    addPluginTemplate({
        filename: 'nuxt-auth-sanctum-config.mjs',
        getContents() {
            return `
                import { defineNuxtPlugin } from '#imports';
                import defu from 'defu';
                import sanctumConfig from '${configPath}';

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

                    const config = defu(sanctumConfig, defaultConfig);

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
