import { FetchError } from 'ofetch';
import { defineNuxtPlugin, useState } from '#app';
import { createHttpClient } from './httpFactory';
import { useSanctumUser } from './composables/useSanctumUser';
import { useSanctumConfig } from './composables/useSanctumConfig';
import { createConsola, type ConsolaInstance } from 'consola';
import { LOGGER_NAME } from '../constants';

function createSanctumLogger(logLevel: number) {
    const envSuffix = import.meta.env.SSR ? 'ssr' : 'csr';
    const loggerName = LOGGER_NAME + ':' + envSuffix;

    return createConsola({ level: logLevel }).withTag(loggerName);
}

function handleIdentityLoadError(error: Error, logger: ConsolaInstance) {
    if (
        error instanceof FetchError &&
        error.response &&
        [401, 419].includes(error.response.status)
    ) {
        logger.debug(
            'User is not authenticated on plugin initialization, status:',
            error.response.status
        );
    } else {
        logger.error('Unable to load user identity from API', error);
    }
}

export default defineNuxtPlugin(async () => {
    const user = useSanctumUser();
    const options = useSanctumConfig();
    const logger = createSanctumLogger(options.logLevel);
    const client = createHttpClient(logger);

    const identityFetchedOnInit = useState<boolean>(
        'sanctum.user.loaded',
        () => false
    );

    if (user.value === null && identityFetchedOnInit.value === false) {
        identityFetchedOnInit.value = true;

        try {
            user.value = await client(options.endpoints.user);
        } catch (error) {
            handleIdentityLoadError(error as Error, logger);
        }
    }

    return {
        provide: {
            sanctumClient: client,
        },
    };
});
