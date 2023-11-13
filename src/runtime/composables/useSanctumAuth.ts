import { type Ref, computed } from 'vue';
import { useSanctumClient } from './useSanctumClient';
import { useSanctumUser } from './useSanctumUser';
import { navigateTo, useNuxtApp, useRoute, useRuntimeConfig } from '#app';
import { SanctumModuleOptions } from '~/src/types';

export interface SanctumAuth<T> {
    user: Ref<T | null>;
    isAuthenticated: Ref<boolean>;
    login: (credentials: Record<string, any>) => Promise<void>;
    logout: () => Promise<void>;
}

/**
 * Provides authentication methods for Laravel Sanctum
 *
 * @param T Type of the user object
 */
export const useSanctumAuth = <T>(): SanctumAuth<T> => {
    const nuxtApp = useNuxtApp();

    const user = useSanctumUser<T>();
    const client = useSanctumClient();
    const options = useRuntimeConfig().public.sanctum as SanctumModuleOptions;

    const isAuthenticated = computed(() => {
        return user.value !== null;
    });

    async function refreshIdentity() {
        user.value = await client<T>(options.endpoints.user);
    }

    /**
     * Calls the login endpoint and sets the user object to the current state
     *
     * @param credentials Credentials to pass to the login endpoint
     */
    async function login(credentials: Record<string, any>) {
        if (isAuthenticated.value === true) {
            throw new Error('User is already authenticated');
        }

        await client(options.endpoints.login, {
            method: 'post',
            body: credentials,
        });

        await refreshIdentity();

        if (options.redirect.keepRequestedRoute) {
            const route = useRoute();
            const requestedRoute = route.query.redirect as string | undefined;

            if (requestedRoute) {
                await nuxtApp.runWithContext(() => navigateTo(requestedRoute));
            }
        }

        if (options.redirect.onLogin) {
            const redirect = options.redirect.onLogin as string;

            await nuxtApp.runWithContext(() => navigateTo(redirect));
        }
    }

    /**
     * Calls the logout endpoint and clears the user object
     */
    async function logout() {
        if (isAuthenticated.value === false) {
            throw new Error('User is not authenticated');
        }

        await client(options.endpoints.logout, { method: 'post' });

        user.value = null;

        if (options.redirect.onLogout) {
            const redirect = options.redirect.onLogout as string;

            await nuxtApp.runWithContext(() => navigateTo(redirect));
        }
    }

    return {
        user,
        isAuthenticated,
        login,
        logout,
    } as SanctumAuth<T>;
};
