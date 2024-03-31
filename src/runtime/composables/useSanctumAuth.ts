import { type Ref, computed } from 'vue';
import { useSanctumClient } from './useSanctumClient';
import { useSanctumUser } from './useSanctumUser';
import { navigateTo, useNuxtApp, useRoute } from '#app';
import { useSanctumConfig } from './useSanctumConfig';

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
    const options = useSanctumConfig();

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
        const currentRoute = useRoute();

        if (isAuthenticated.value === true) {
            if (options.redirectIfAuthenticated === false) {
                throw new Error('User is already authenticated');
            }

            if (
                options.redirect.onLogin === false ||
                options.redirect.onLogin === currentRoute.path
            ) {
                return;
            }

            await nuxtApp.runWithContext(() =>
                navigateTo(options.redirect.onLogin as string)
            );
        }

        await client(options.endpoints.login, {
            method: 'post',
            body: credentials,
        });

        await refreshIdentity();

        if (options.redirect.keepRequestedRoute) {
            const requestedRoute = currentRoute.query.redirect;

            if (requestedRoute && requestedRoute !== currentRoute.path) {
                await nuxtApp.runWithContext(() =>
                    navigateTo(requestedRoute as string)
                );

                return;
            }
        }

        if (
            options.redirect.onLogin === false ||
            currentRoute.path === options.redirect.onLogin
        ) {
            return;
        }

        await nuxtApp.runWithContext(() =>
            navigateTo(options.redirect.onLogin as string)
        );
    }

    /**
     * Calls the logout endpoint and clears the user object
     */
    async function logout() {
        if (isAuthenticated.value === false) {
            throw new Error('User is not authenticated');
        }

        const currentRoute = useRoute();

        await client(options.endpoints.logout, { method: 'post' });

        user.value = null;

        if (
            options.redirect.onLogout === false ||
            currentRoute.path === options.redirect.onLogout
        ) {
            return;
        }

        await nuxtApp.runWithContext(() =>
            navigateTo(options.redirect.onLogout as string)
        );
    }

    return {
        user,
        isAuthenticated,
        login,
        logout,
        refreshIdentity,
    } as SanctumAuth<T>;
};
