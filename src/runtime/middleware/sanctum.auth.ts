import { defineNuxtRouteMiddleware, navigateTo, createError } from '#app';
import type { RouteLocationRaw } from 'vue-router';
import { useSanctumUser } from '../composables/useSanctumUser';
import { useSanctumConfig } from '../composables/useSanctumConfig';

export default defineNuxtRouteMiddleware((to) => {
    const user = useSanctumUser();
    const options = useSanctumConfig();

    const isAuthenticated = user.value !== null;

    if (isAuthenticated === true) {
        return;
    }

    const endpoint = options.redirect.onAuthOnly;

    if (endpoint === false) {
        throw createError({ statusCode: 403 });
    }

    const redirect: RouteLocationRaw = { path: endpoint };

    if (options.redirect.keepRequestedRoute) {
        redirect.query = { redirect: to.fullPath };
    }

    return navigateTo(redirect, { replace: true });
});
