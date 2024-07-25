export default defineNuxtConfig({
    devtools: { enabled: true },
    ssr: true,

    typescript: {
        strict: true,
        typeCheck: false, // disabled due to https://github.com/vuejs/language-tools/issues/3969
    },

    modules: ['../src/module'],

    sanctum: {
        baseUrl: 'http://localhost:80',
        mode: 'cookie',
        logLevel: 5,
        redirect: {
            keepRequestedRoute: true,
            onAuthOnly: '/login',
            onGuestOnly: '/profile',
            onLogin: '/welcome',
            onLogout: '/logout',
        },
        endpoints: {
            csrf: '/sanctum/csrf-cookie',
            login: '/login',
            logout: '/logout',
            user: '/api/user',
        },
        globalMiddleware: {
            allow404WithoutAuth: true,
            enabled: false,
        },
    },

    compatibilityDate: '2024-07-26',
});
