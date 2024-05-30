import type { FetchContext } from 'ofetch';
import type { ConsolaInstance } from 'consola';
import type { NuxtApp } from '#app';
import { defineAppConfig } from '#imports';

export default defineAppConfig({
    sanctum: {
        interceptors: {
            onRequest: async (
                app: NuxtApp,
                ctx: FetchContext,
                logger: ConsolaInstance
            ) => {
                logger.debug(`custom onRequest interceptor (${ctx.request})`);
            },

            onResponse: async (
                app: NuxtApp,
                ctx: FetchContext,
                logger: ConsolaInstance
            ) => {
                logger.debug(`custom onResponse interceptor (${ctx.request})`);
            },
        },
    },
});
