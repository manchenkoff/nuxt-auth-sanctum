import {
    defineNuxtRouteMiddleware,
    navigateTo,
    createError,
} from '#app';
import { useSanctumUser } from '../composables/useSanctumUser';
import { useSanctumConfig } from '../composables/useSanctumConfig';

export default defineNuxtRouteMiddleware(() => {
    const user = useSanctumUser();
    const config = useSanctumConfig();

    const isAuthenticated = user.value !== null;

    if (isAuthenticated === false) {
        return;
    }

    const endpoint = config.redirect.onGuestOnly;

    if (endpoint === false) {
        throw createError({ statusCode: 403 });
    }

    return navigateTo(endpoint, { replace: true });
});
