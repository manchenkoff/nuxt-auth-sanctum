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
        logLevel: 5,
        redirect: {
            keepRequestedRoute: {
                afterLogin: true,
                afterRegistration: true,
            },
            onAuthOnly: '/login',
            onGuestOnly: '/profile',
            onLogin: '/welcome',
            onLogout: '/logout',
            onRegister: '/verify-email',
        },
        endpoints: {
            csrf: '/sanctum/csrf-cookie',
            login: '/api/login',
            logout: '/api/logout',
            user: '/api/user',
            register: '/register',
        },
        globalMiddleware: {
            allow404WithoutAuth: true,
            enabled: false,
        },
    },
});
