export default defineNuxtConfig({
    devtools: { enabled: true },
    ssr: true,
    typescript: {
        strict: true,
        typeCheck: true,
    },

    modules: ['../src/module'],

    sanctum: {
        baseUrl: 'http://localhost:80',
        redirect: {
            keepRequestedRoute: true,
            onAuthOnly: '/login',
            onGuestOnly: '/profile',
            onLogin: '/welcome',
            onLogout: '/logout',
        },
        endpoints: {
            csrf: '/sanctum/csrf-cookie',
            login: '/api/login',
            logout: '/api/logout',
            user: '/api/user',
        },
    },
});
