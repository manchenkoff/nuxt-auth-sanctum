import { defineNuxtRouteMiddleware, navigateTo, createError } from '#app';
import type { RouteLocationRaw } from 'vue-router';
import { useSanctumConfig } from '../composables/useSanctumConfig';
import { useSanctumAuth } from '../composables/useSanctumAuth';

export default defineNuxtRouteMiddleware((to) => {
    const options = useSanctumConfig();
    const { isAuthenticated } = useSanctumAuth();

    if (isAuthenticated.value === true) {
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
