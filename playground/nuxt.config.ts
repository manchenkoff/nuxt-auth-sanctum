export default defineNuxtConfig({
  modules: ['../src/module'],
  ssr: true,
  devtools: { enabled: true },
  compatibilityDate: '2024-09-28',
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
      prepend: false,
    },
  },
})
