import type { $Fetch, FetchOptions } from 'ofetch';
import {
    useCookie,
    useRequestEvent,
    useRequestHeaders,
    navigateTo,
    useNuxtApp,
} from '#app';
import { useSanctumUser } from './composables/useSanctumUser';
import { useSanctumConfig } from './composables/useSanctumConfig';
import { useRequestURL } from 'nuxt/app';

export const SECURE_METHODS = new Set(['post', 'delete', 'put', 'patch']);

export function createHttpClient(): $Fetch {
    const config = useSanctumConfig();
    const event = useRequestEvent();
    const user = useSanctumUser();
    const nuxtApp = useNuxtApp();

    /**
     * Request a new CSRF cookie from the API and pass it to the headers collection
     * @param headers Headers collection to extend
     * @returns {HeadersInit}
     */
    async function buildClientHeaders(
        headers: HeadersInit | undefined
    ): Promise<HeadersInit> {
        await $fetch(config.endpoints.csrf, {
            baseURL: config.baseUrl,
            credentials: 'include',
        });

        const csrfToken = useCookie(config.csrf.cookie, {
            readonly: true,
        }).value;

        return {
            ...headers,
            ...(csrfToken && { [config.csrf.header]: csrfToken }),
        };
    }

    /**
     * Pass all cookies, headers and referrer from the client to the API
     * @param headers Headers collection to extend
     * @returns { HeadersInit }
     */
    function buildServerHeaders(headers: HeadersInit | undefined): HeadersInit {
        const csrfToken = useCookie(config.csrf.cookie, {
            readonly: true,
        }).value;
        const clientCookies = useRequestHeaders(['cookie']);
        const origin = config.origin ?? useRequestURL().origin;

        return {
            ...headers,
            // use the origin from the request headers if not set
            Referer: origin,
            ...(clientCookies.cookie && clientCookies),
            ...(csrfToken && { [config.csrf.header]: csrfToken }),
        };
    }

    const httpOptions: FetchOptions = {
        baseURL: config.baseUrl,
        credentials: 'include',
        redirect: 'manual',
        retry: config.client.retry,

        async onRequest({ options }): Promise<void> {
            const method = options.method?.toLowerCase() ?? 'get';

            options.headers = {
                Accept: 'application/json',
                ...options.headers,
            };

            if (config.authTokenStorage) {
                const authToken = await config.authTokenStorage.get();
                if (authToken) options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${authToken}`,
                };
            }

            // https://laravel.com/docs/10.x/routing#form-method-spoofing
            if (options.body instanceof FormData && method === 'put') {
                options.method = 'POST';
                options.body.append('_method', 'PUT');
            }

            if (process.server) {
                options.headers = buildServerHeaders(options.headers);
            }

            if (process.client) {
                if (!SECURE_METHODS.has(method)) {
                    return;
                }

                options.headers = await buildClientHeaders(options.headers);
            }
        },

        async onResponse({ response }): Promise<void> {
            // pass all cookies from the API to the client on SSR response
            if (process.server) {
                const serverCookieName = 'set-cookie';
                const cookie = response.headers.get(serverCookieName);

                if (cookie === null) {
                    return;
                }

                event?.headers.append(serverCookieName, cookie);
            }

            // follow redirects on client
            if (response.redirected) {
                await nuxtApp.runWithContext(() => navigateTo(response.url));
            }
        },

        async onResponseError({ request, response }): Promise<void> {
            if (response.status === 401) {
                // do not redirect when requesting the user endpoint
                // this prevents an infinite loop (ERR_TOO_MANY_REDIRECTS)
                if (request.toString().endsWith(config.endpoints.user)) {
                    return;
                }

                user.value = null;

                if (config.redirect.onLogout) {
                    await nuxtApp.runWithContext(() =>
                        navigateTo(config.redirect.onLogout as string)
                    );
                }
            }
        },
    };

    return $fetch.create(httpOptions) as $Fetch;
}
