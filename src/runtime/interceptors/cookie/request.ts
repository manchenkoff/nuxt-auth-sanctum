import type { FetchContext } from 'ofetch';
import type { ConsolaInstance } from 'consola';
import { useSanctumConfig } from '../../composables/useSanctumConfig';
import type { SanctumModuleOptions } from '../../types/options';
import {
    useCookie,
    useRequestHeaders,
    useRequestURL,
    type NuxtApp,
} from '#app';

type Headers = HeadersInit | undefined;

const SECURE_METHODS = new Set(['post', 'delete', 'put', 'patch']);
const COOKIE_OPTIONS: { readonly: true } = { readonly: true };

/**
 * Pass all cookies, headers and referrer from the client to the API
 * @param headers Headers collection to extend
 * @param config Module configuration
 * @returns {HeadersInit} Enriched headers collection
 */
function buildServerHeaders(
    headers: Headers,
    config: SanctumModuleOptions
): HeadersInit {
    const clientCookies = useRequestHeaders(['cookie']);
    const origin = config.origin ?? useRequestURL().origin;

    return {
        ...headers,
        Referer: origin,
        Origin: origin,
        ...(clientCookies.cookie && clientCookies),
    };
}

/**
 * Request a new CSRF cookie from the API
 * @param config Module configuration
 * @param logger Logger instance
 * @returns {Promise<void>}
 */
async function initCsrfCookie(
    config: SanctumModuleOptions,
    logger: ConsolaInstance
): Promise<void> {
    await $fetch(config.endpoints.csrf, {
        baseURL: config.baseUrl,
        credentials: 'include',
    });

    logger.debug('CSRF cookie has been initialized');
}

/**
 * Add CSRF token to the headers collection to pass from the client to the API
 * @param headers Headers collection to extend
 * @param config Module configuration
 * @param logger Logger instance
 * @returns {Promise<HeadersInit>} Enriched headers collection
 */
async function useCsrfHeader(
    headers: Headers,
    config: SanctumModuleOptions,
    logger: ConsolaInstance
): Promise<HeadersInit> {
    let csrfToken = useCookie(config.csrf.cookie, COOKIE_OPTIONS);

    if (!csrfToken.value) {
        await initCsrfCookie(config, logger);

        csrfToken = useCookie(config.csrf.cookie, COOKIE_OPTIONS);
    }

    if (!csrfToken.value) {
        logger.warn(
            `${config.csrf.cookie} cookie is missing, unable to set ${config.csrf.header} header`
        );

        return headers as HeadersInit;
    }

    logger.debug(`Added ${config.csrf.header} header to pass to the API`);

    return {
        ...headers,
        ...(csrfToken.value && {
            [config.csrf.header]: csrfToken.value,
        }),
    };
}
/**
 * Handle cookies and headers for the request
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export default async function handleRequestCookies(
    app: NuxtApp,
    ctx: FetchContext,
    logger: ConsolaInstance
): Promise<void> {
    const config = useSanctumConfig();
    const method = ctx.options.method?.toLowerCase() ?? 'get';

    if (import.meta.server) {
        ctx.options.headers = buildServerHeaders(ctx.options.headers, config);
    }

    if (SECURE_METHODS.has(method)) {
        ctx.options.headers = await useCsrfHeader(
            ctx.options.headers,
            config,
            logger
        );
    }
}
