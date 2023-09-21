import {
    defineNuxtRouteMiddleware,
    navigateTo,
    useRuntimeConfig,
    createError,
} from '#app';
import { RouteLocationRaw } from 'vue-router';
import { useSanctumUser } from '../composables/useSanctumUser';

export default defineNuxtRouteMiddleware((to) => {
    const user = useSanctumUser();
    const options = useRuntimeConfig().public.sanctum;

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
