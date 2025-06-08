export default defineNuxtConfig({
  modules: ['../src/module'],
  ssr: true,
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-09-28',
  sanctum: {
    baseUrl: '/api/sanctum',
    mode: 'cookie',
    logLevel: 4,
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
    serverProxy: {
      enabled: true,
      route: '/api/sanctum',
      baseUrl: 'http://localhost:80',
    },
  },
})
