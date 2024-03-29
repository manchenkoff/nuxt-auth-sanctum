import { defineNuxtRouteMiddleware, navigateTo, createError } from '#app';
import { useSanctumConfig } from '../composables/useSanctumConfig';
import { useSanctumUser } from '../composables/useSanctumUser';

export default defineNuxtRouteMiddleware(() => {
    const user = useSanctumUser();
    const options = useSanctumConfig();

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
