export default defineNuxtConfig({
    modules: ['../src/module'],
    typescript: {
        strict: true,
        typeCheck: true,
    },
    ssr: true,
    runtimeConfig: {
        public: {
            sanctum: {
                baseUrl: 'http://localhost:80',
                userStateKey: 'sanctum.user.identity',
            },
        },
    },
    sanctum: {
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
    devtools: { enabled: true },
});
