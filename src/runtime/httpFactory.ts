import type { $Fetch, FetchOptions } from 'ofetch';
import { appendResponseHeader } from 'h3';
import {
    splitCookiesString,
    parseString as parseCookieString,
} from 'set-cookie-parser';
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
    const user = useSanctumUser();
    const nuxtApp = useNuxtApp();
    const event = useRequestEvent(nuxtApp);

    /**
     * Request a new CSRF cookie from the API
     * @returns {Promise<void>}
     */
    async function initCsrfCookie(): Promise<void> {
        await $fetch(options.endpoints.csrf, {
            baseURL: options.baseUrl,
            credentials: 'include',
        });

        logger.debug('CSRF cookie has been initialized');
    }

    /**
     * Add CSRF token to the headers collection to pass from the client to the API
     * @param headers Headers collection to extend
     * @returns {Promise<HeadersInit>}
     */
    async function useCsrfHeader(headers: Headers): Promise<HeadersInit> {
        let csrfToken = useCookie(options.csrf.cookie, COOKIE_OPTIONS);

        if (!csrfToken.value) {
            await initCsrfCookie();

            csrfToken = useCookie(options.csrf.cookie, COOKIE_OPTIONS);
        }

        if (!csrfToken.value) {
            logger.warn(
                `${options.csrf.cookie} cookie is missing, unable to set ${options.csrf.header} header`
            );

            return headers as HeadersInit;
        }

        logger.debug(`Added ${options.csrf.header} header to pass to the API`);

        return {
            ...headers,
            ...(csrfToken.value && { [options.csrf.header]: csrfToken.value }),
        };
    }

    /**
     * Pass all cookies, headers and referrer from the client to the API
     * @param headers Headers collection to extend
     * @returns {HeadersInit}
     */
    function buildServerHeaders(headers: Headers): HeadersInit {
        const clientCookies = useRequestHeaders(['cookie']);
        const origin = options.origin ?? useRequestURL().origin;

        return {
            ...headers,
            Referer: origin,
            Origin: origin,
            ...(clientCookies.cookie && clientCookies),
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
            if (method === 'put' && options.body instanceof FormData) {
                options.method = 'POST';
                options.body.append('_method', 'PUT');
            }

            if (import.meta.server) {
                options.headers = buildServerHeaders(options.headers);
            }

            if (SECURE_METHODS.has(method)) {
                options.headers = await useCsrfHeader(options.headers);
            }
        },

        async onResponse({ request, response }): Promise<void> {
            // pass all cookies from the API to the client on SSR response
            if (import.meta.server) {
                const serverCookieName = 'set-cookie';
                const cookieHeader = response.headers.get(serverCookieName);

                if (cookieHeader === null || event === undefined) {
                    logger.debug(
                        `No cookies to pass to the client [${request}]`
                    );

                    return;
                }

                const cookies = splitCookiesString(cookieHeader);
                const cookieNameList = [];

                for (const cookie of cookies) {
                    appendResponseHeader(event, serverCookieName, cookie);

                    const metadata = parseCookieString(cookie);
                    cookieNameList.push(metadata.name);
                }

                logger.debug(
                    `Append API cookies from SSR to CSR response [${cookieNameList.join(', ')}]`
                );
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
