export default defineNuxtConfig({
    modules: ['../src/module'],
    sanctum: {
        baseUrl: 'http://localhost:80',
        origin: 'http://localhost:3000',
        userStateKey: 'sanctum.user.identity',
        client: {
            retry: false,
        },
        csrf: {
            cookie: 'XSRF-TOKEN',
            header: 'X-XSRF-TOKEN',
        },
        redirect: {
            keepRequestedRoute: true,
            onAuthOnly: '/login',
            onGuestOnly: '/profile',
            onLogin: '/welcome',
            onLogout: '/logout',
        },
        endpoints: {
            csrf: '/sanctum/csrf-cookie',
            login: '/api/login/credentials',
            logout: '/api/logout',
            user: '/api/user',
        },
    },
    devtools: { enabled: true },
});
