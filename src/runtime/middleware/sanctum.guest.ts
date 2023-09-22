import {
    defineNuxtRouteMiddleware,
    navigateTo,
    useRuntimeConfig,
    createError,
} from '#app';
import { SanctumModuleOptions } from '~/src/types';
import { useSanctumUser } from '../composables/useSanctumUser';

export default defineNuxtRouteMiddleware(() => {
    const user = useSanctumUser();
    const options = useRuntimeConfig().public.sanctum as SanctumModuleOptions;

    const isAuthenticated = user.value !== null;

    if (isAuthenticated === false) {
        return;
    }

    const endpoint = options.redirect.onGuestOnly;

    if (endpoint === false) {
        throw createError({ statusCode: 403 });
    }

    return navigateTo(endpoint, { replace: true });
});
