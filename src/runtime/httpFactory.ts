import type { $Fetch, FetchOptions } from 'ofetch';
import {
    useCookie,
    useRequestEvent,
    useRequestHeaders,
    useRequestURL,
    navigateTo,
    useNuxtApp,
} from '#app';
import { useSanctumUser } from './composables/useSanctumUser';
import { useSanctumConfig } from './composables/useSanctumConfig';
import { type ConsolaInstance } from 'consola';

type Headers = HeadersInit | undefined;

const SECURE_METHODS = new Set(['post', 'delete', 'put', 'patch']);
const COOKIE_OPTIONS: { readonly: true } = { readonly: true };

export function createHttpClient(logger: ConsolaInstance): $Fetch {
    const options = useSanctumConfig();
    const event = useRequestEvent();
    const user = useSanctumUser();
    const nuxtApp = useNuxtApp();

    /**
     * Request a new CSRF cookie from the API and pass it to the headers collection
     * @param headers Headers collection to extend
     * @returns {HeadersInit}
     */
    async function buildClientHeaders(headers: Headers): Promise<HeadersInit> {
        await $fetch(options.endpoints.csrf, {
            baseURL: options.baseUrl,
            credentials: 'include',
        });

        const csrfToken = useCookie(options.csrf.cookie, COOKIE_OPTIONS).value;

        if (!csrfToken) {
            logger.warn(
                'CSRF cookie is missing in response, check your API configuration'
            );
        }

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
    function buildServerHeaders(headers: Headers): HeadersInit {
        const csrfToken = useCookie(options.csrf.cookie, COOKIE_OPTIONS).value;
        const clientCookies = useRequestHeaders(['cookie']);
        const origin = options.origin ?? useRequestURL().origin;

        if (!csrfToken) {
            logger.warn(
                `Unable to set ${options.csrf.header} header, CSRF cookie is missing`
            );
        }

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

        async onRequest({ request, options }): Promise<void> {
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
                    logger.debug(
                        `Skipping CSRF token header for safe method [${request}]`
                    );

                    return;
                }

                options.headers = await buildClientHeaders(options.headers);
            }
        },

        async onResponse({ request, response }): Promise<void> {
            // pass all cookies from the API to the client on SSR response
            if (import.meta.server) {
                const serverCookieName = 'set-cookie';
                const cookie = response.headers.get(serverCookieName);

                if (cookie === null || event === undefined) {
                    logger.debug(
                        `No cookies to pass to the client [${request}]`
                    );
                    return;
                }

                logger.debug(
                    `Passing API cookies from Nuxt server to the client response [${request}]`,
                    cookie
                );

                event.headers.append(serverCookieName, cookie);
            }

            // follow redirects on client
            if (response.redirected) {
                await nuxtApp.runWithContext(() => navigateTo(response.url));
            }
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
