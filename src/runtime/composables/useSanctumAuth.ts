import { type Ref, computed } from 'vue';
import { useSanctumClient } from './useSanctumClient';
import { useSanctumUser } from './useSanctumUser';
import { useSanctumConfig } from './useSanctumConfig';
import { navigateTo, useNuxtApp, useRoute } from '#app';

export interface SanctumAuth<T> {
    user: Ref<T | null>;
    isAuthenticated: Ref<boolean>;
    login: (credentials: Record<string, any>) => Promise<void>;
    logout: () => Promise<void>;
    refreshIdentity: () => Promise<void>;
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
    const config = useSanctumConfig();

    const isAuthenticated = computed(() => {
        return user.value !== null;
    });

    async function refreshIdentity() {
        user.value = await client<T>(config.endpoints.user);
    }

    /**
     * Calls the login endpoint and sets the user object to the current state
     *
     * @param credentials Credentials to pass to the login endpoint
     */
    async function login(credentials: Record<string, any>) {
        if (isAuthenticated.value === true) {
            if (config.redirectIfAuthenticated === false) {
                throw new Error('User is already authenticated');
            }

            if (config.redirect.onLogin === false) {
                return;
            }

            const redirect = config.redirect.onLogin as string;

            await nuxtApp.runWithContext(() => navigateTo(redirect));
        }

        const endpointResult = await client(config.endpoints.login, {
            method: 'post',
            body: credentials,
        });

        if (config.authTokenStorage)
            config.authTokenStorage.add(endpointResult);

        await refreshIdentity();

        if (config.redirect.keepRequestedRoute) {
            const route = useRoute();
            const requestedRoute = route.query.redirect as string | undefined;
            if (requestedRoute) {
                await nuxtApp.runWithContext(() => navigateTo(requestedRoute));
                return;
            }
        }

        if (config.redirect.onLogin) {
            const redirect = config.redirect.onLogin as string;
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

        await client(config.endpoints.logout, { method: 'post' });

        if (config.authTokenStorage) config.authTokenStorage.delete();

        user.value = null;

        if (config.redirect.onLogout) {
            const redirect = config.redirect.onLogout as string;

            await nuxtApp.runWithContext(() => navigateTo(redirect));
        }
    }

    return {
        user,
        isAuthenticated,
        login,
        logout,
        refreshIdentity,
    } as SanctumAuth<T>;
};
