import type { FetchContext } from 'ofetch';
import type { ConsolaInstance } from 'consola';
import { type NuxtApp } from '#app';
import { useSanctumAppConfig } from '../../composables/useSanctumAppConfig';

/**
 * Use token in authentication header for the request
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export default async function handleRequestTokenHeader(
    app: NuxtApp,
    ctx: FetchContext,
    logger: ConsolaInstance
): Promise<void> {
    const appConfig = useSanctumAppConfig();

    const token = await appConfig.tokenStorage!.get(app);

    if (!token) {
        logger.debug('Authentication token is not set in the storage');
        return;
    }

    ctx.options.headers = {
        ...ctx.options.headers,
        Authorization: `Bearer ${token}`,
    };
}
