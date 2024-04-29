import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import type { RouteLocationRaw } from 'vue-router';
import { useSanctumConfig } from '../composables/useSanctumConfig';
import { useSanctumAuth } from '../composables/useSanctumAuth';

export default defineNuxtRouteMiddleware((to) => {
    const options = useSanctumConfig();
    const { isAuthenticated } = useSanctumAuth();

    const [homePage, loginPage] = [
        options.redirect.onGuestOnly,
        options.redirect.onAuthOnly,
    ];

    if (homePage === false) {
        throw new Error(
            'You must define onGuestOnly route when using global middleware.'
        );
    }

    if (loginPage === false) {
        throw new Error(
            'You must define onAuthOnly route when using global middleware.'
        );
    }

    if (
        options.globalMiddleware.allow404WithoutAuth &&
        to.matched.length === 0
    ) {
        return;
    }

    if (
        to.meta.excludeFromSanctum === true ||
        to.meta.sanctum?.excluded === true
    ) {
        return;
    }

    const isPageForGuestsOnly =
        to.path === loginPage || to.meta.sanctum?.guestOnly === true;

    if (isAuthenticated.value === true) {
        if (isPageForGuestsOnly) {
            return navigateTo(homePage, { replace: true });
        }

        return;
    }

    if (isPageForGuestsOnly) {
        return;
    }

    const redirect: RouteLocationRaw = { path: loginPage };

    if (options.redirect.keepRequestedRoute) {
        redirect.query = { redirect: to.fullPath };
    }

    return navigateTo(redirect, { replace: true });
});
