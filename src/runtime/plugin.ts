import { FetchError } from 'ofetch';
import { defineNuxtPlugin } from '#app';
import { createHttpClient } from './httpFactory';
import { useSanctumUser } from './composables/useSanctumUser';
import type { SanctumModuleOptions } from '../types';

function handleIdentityLoadError(error: Error) {
    if (
        error instanceof FetchError &&
        error.response &&
        [401, 419].includes(error.response.status)
    ) {
        // unauthenticated user, unable to get information
    } else {
        console.error('Unable to load user identity', error);
    }
}

export default defineNuxtPlugin(async (nuxtApp) => {
    const user = useSanctumUser();
    const client = createHttpClient();

    const options = nuxtApp.$config.public.sanctum as SanctumModuleOptions;

    if (user.value === null) {
        try {
            user.value = await client(options.endpoints.user);
        } catch (error) {
            handleIdentityLoadError(error as Error);
        }
    }

    return {
        provide: {
            sanctumClient: client,
        },
    };
});
