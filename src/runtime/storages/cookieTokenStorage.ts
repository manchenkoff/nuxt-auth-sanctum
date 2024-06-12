import { useCookie, type NuxtApp } from '#app';
import { unref } from 'vue';
import type { TokenStorage } from '../types/config';

const cookieTokenKey = 'sanctum.token.cookie';

/**
 * Token storage using a secure cookie.
 * Works with both CSR/SSR modes.
 */
export const cookieTokenStorage: TokenStorage = {
    async get(app: NuxtApp) {
        return await app.runWithContext(() => {
            const cookie = useCookie(cookieTokenKey, { readonly: true });

            return unref(cookie.value) ?? undefined;
        });
    },
    async set(app: NuxtApp, token?: string) {
        await app.runWithContext(() => {
            const cookie = useCookie(cookieTokenKey, { secure: true });

            cookie.value = token;
        });
    },
};
