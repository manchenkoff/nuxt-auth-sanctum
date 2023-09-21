import { computed } from 'vue';
import { useSanctumClient } from './useSanctumClient';
import { useSanctumUser } from './useSanctumUser';
import { useRoute, useRouter, useRuntimeConfig } from '#app';
import { SanctumOptions } from '~/src/types';

/**
 * Provides authentication methods for Laravel Sanctum
 *
 * @param T Type of the user object
 */
export const useSanctumAuth = <T>() => {
    const user = useSanctumUser<T>();
    const client = useSanctumClient();
    const router = useRouter();
    const options = useRuntimeConfig().public.sanctum as SanctumOptions;

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
    async function login(credentials: Record<string, string | boolean>) {
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
                await router.push(requestedRoute);

                return;
            }
        }

        if (options.redirect.onLogin) {
            await router.push(options.redirect.onLogin);
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
            await router.push(options.redirect.onLogout);
        }
    }

    return {
        user,
        isAuthenticated,
        login,
        logout,
    };
};
