import type { $Fetch, FetchOptions, FetchContext } from 'ofetch';
import { useNuxtApp } from '#app';
import { useSanctumUser } from './composables/useSanctumUser';
import { useSanctumConfig } from './composables/useSanctumConfig';
import { type ConsolaInstance } from 'consola';
import { useSanctumAppConfig } from './composables/useSanctumAppConfig';
import handleRequestCookies from './interceptors/cookie/request';
import handleResponseHeaders from './interceptors/cookie/response';
import handleRequestHeaders from './interceptors/common/request';

export function createHttpClient(logger: ConsolaInstance): $Fetch {
    const options = useSanctumConfig();
    const user = useSanctumUser();
    const appConfig = useSanctumAppConfig();
    const nuxtApp = useNuxtApp();

    const requestInterceptors = [handleRequestHeaders, handleRequestCookies];
    const responseInterceptors = [handleResponseHeaders];

    if (appConfig.interceptors?.onRequest) {
        requestInterceptors.push(appConfig.interceptors.onRequest);
    }

    if (appConfig.interceptors?.onResponse) {
        responseInterceptors.push(appConfig.interceptors.onResponse);
    }

    const httpOptions: FetchOptions = {
        baseURL: options.baseUrl,
        credentials: 'include',
        redirect: 'manual',
        retry: options.client.retry,

        async onRequest(context: FetchContext): Promise<void> {
            await nuxtApp.runWithContext(() => {
                for (const interceptor of requestInterceptors) {
                    interceptor(nuxtApp, context, logger);
                }
            });
        },

        async onResponse(context: FetchContext): Promise<void> {
            await nuxtApp.runWithContext(() => {
                for (const interceptor of responseInterceptors) {
                    interceptor(nuxtApp, context, logger);
                }
            });
        },

        async onResponseError({ request, response }): Promise<void> {
            if (response.status === 419) {
                logger.warn(
                    'CSRF token mismatch, check your API configuration'
                );

                return;
            }

            if (
                response.status === 401 &&
                request.toString().endsWith(options.endpoints.user) &&
                user.value !== null
            ) {
                logger.warn(
                    'User session is not set in API or expired, resetting identity'
                );
                user.value = null;
            }
        },
    };

    return $fetch.create(httpOptions) as $Fetch;
}
