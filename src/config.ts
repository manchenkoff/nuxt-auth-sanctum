import type { SanctumModuleOptions } from './runtime/types';

export const defaultModuleOptions: Partial<SanctumModuleOptions> = {
    userStateKey: 'sanctum.user.identity',
    redirectIfAuthenticated: false,
    endpoints: {
        csrf: '/sanctum/csrf-cookie',
        login: '/login',
        logout: '/logout',
        user: '/api/user',
    },
    csrf: {
        cookie: 'XSRF-TOKEN',
        header: 'X-XSRF-TOKEN',
    },
    client: {
        retry: false,
    },
    redirect: {
        keepRequestedRoute: false,
        onLogin: '/',
        onLogout: '/',
        onAuthOnly: '/login',
        onGuestOnly: '/',
    },
    globalMiddleware: {
        enabled: false,
        allow404WithoutAuth: true,
    },
    logLevel: 3,
};
