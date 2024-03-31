import type { $Fetch, FetchOptions } from 'ofetch';
import {
    useCookie,
    useRequestEvent,
    useRequestHeaders,
    navigateTo,
    useNuxtApp,
} from '#app';
import { useSanctumUser } from './composables/useSanctumUser';
import { useRequestURL } from 'nuxt/app';
import { useSanctumConfig } from './composables/useSanctumConfig';

export const SECURE_METHODS = new Set(['post', 'delete', 'put', 'patch']);

export function createHttpClient(): $Fetch {
    const options = useSanctumConfig();
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
        await $fetch(options.endpoints.csrf, {
            baseURL: options.baseUrl,
            credentials: 'include',
        });

        const csrfToken = useCookie(options.csrf.cookie, {
            readonly: true,
        }).value;

        return {
            ...headers,
            ...(csrfToken && { [options.csrf.header]: csrfToken }),
        };
    }

    /**
     * Pass all cookies, headers and referrer from the client to the API
     * @param headers Headers collection to extend
     * @returns { HeadersInit }
     */
    function buildServerHeaders(headers: HeadersInit | undefined): HeadersInit {
        const csrfToken = useCookie(options.csrf.cookie, {
            readonly: true,
        }).value;
        const clientCookies = useRequestHeaders(['cookie']);
        const origin = options.origin ?? useRequestURL().origin;

        return {
            ...headers,
            Referer: origin,
            Origin: origin,
            ...(clientCookies.cookie && clientCookies),
            ...(csrfToken && { [options.csrf.header]: csrfToken }),
        };
    }

    const httpOptions: FetchOptions = {
        baseURL: options.baseUrl,
        credentials: 'include',
        redirect: 'manual',
        retry: options.client.retry,

        async onRequest({ options }): Promise<void> {
            const method = options.method?.toLowerCase() ?? 'get';

            options.headers = {
                Accept: 'application/json',
                ...options.headers,
            };

            // https://laravel.com/docs/10.x/routing#form-method-spoofing
            if (options.body instanceof FormData && method === 'put') {
                options.method = 'POST';
                options.body.append('_method', 'PUT');
            }

            if (import.meta.server) {
                options.headers = buildServerHeaders(options.headers);
            }

            if (import.meta.client) {
                if (!SECURE_METHODS.has(method)) {
                    return;
                }

                options.headers = await buildClientHeaders(options.headers);
            }
        },

        async onResponse({ response }): Promise<void> {
            // pass all cookies from the API to the client on SSR response
            if (import.meta.server) {
                const serverCookieName = 'set-cookie';
                const cookie = response.headers.get(serverCookieName);

                if (cookie === null || event === undefined) {
                    return;
                }

                event.headers.append(serverCookieName, cookie);
            }

            // follow redirects on client
            if (response.redirected) {
                await nuxtApp.runWithContext(() => navigateTo(response.url));
            }
        },

        async onResponseError({ response }): Promise<void> {
            if (response.status === 401) {
                user.value = null;

                const currentRoute = nuxtApp.$router.currentRoute.value;

                if (
                    options.redirect.onLogout === false ||
                    options.redirect.onLogout === currentRoute.path ||
                    options.redirect.onAuthOnly === currentRoute.path
                ) {
                    return;
                }

                await nuxtApp.runWithContext(() =>
                    navigateTo(options.redirect.onLogout as string)
                );
            }
        },
    };

    return $fetch.create(httpOptions) as $Fetch;
}
