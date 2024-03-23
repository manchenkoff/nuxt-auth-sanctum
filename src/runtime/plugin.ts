import { FetchError } from 'ofetch';
import { defineNuxtPlugin } from '#app';
import { createHttpClient } from './httpFactory';
import { useSanctumUser } from './composables/useSanctumUser';
import { useSanctumConfig } from './composables/useSanctumConfig';

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
    const config = useSanctumConfig();
    const client = createHttpClient();

    if (user.value === null) {
        try {
            user.value = await client(config.endpoints.user);
        } catch (error) {
            handleIdentityLoadError(error as Error);
        }
    }

    nuxtApp.provide('sanctumClient', client);
});
