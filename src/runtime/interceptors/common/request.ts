import type { FetchContext } from 'ofetch';
import { type NuxtApp } from '#app';

/**
 * Modify request before sending it to the Laravel API
 * @param app Nuxt application instance
 * @param ctx Fetch context
 */
export default async function handleRequestHeaders(
    app: NuxtApp,
    ctx: FetchContext
) {
    const method = ctx.options.method?.toLowerCase() ?? 'get';

    ctx.options.headers = {
        Accept: 'application/json',
        ...ctx.options.headers,
    };

    // https://laravel.com/docs/10.x/routing#form-method-spoofing
    if (method === 'put' && ctx.options.body instanceof FormData) {
        ctx.options.method = 'POST';
        ctx.options.body.append('_method', 'PUT');
    }
}
