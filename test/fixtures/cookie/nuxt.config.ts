import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [MyModule],

  ssr: true,

  compatibilityDate: '2026-01-01',

  sanctum: {
    logLevel: 3,
    baseUrl: '/',
    mode: 'cookie',
    userStateKey: 'sanctum.user.identity',
    endpoints: {
      csrf: '/api/csrf',
      login: '/api/login',
      logout: '/api/logout',
      user: '/api/user',
    },
    redirectIfAuthenticated: true,
    redirectIfUnauthenticated: true,
    redirect: {
      keepRequestedRoute: true,
      onAuthOnly: '/login',
      onGuestOnly: '/',
      onLogin: '/profile',
      onLogout: '/bye',
    },
    csrf: {
      cookie: 'XSRF-TOKEN',
      header: 'X-XSRF-TOKEN',
    },
    client: {
      retry: false,
      initialRequest: true,
    },
    globalMiddleware: {
      enabled: false,
      prepend: false,
      allow404WithoutAuth: true,
    },
    serverProxy: {
      enabled: false,
      route: '/api/sanctum',
      baseUrl: 'http://localhost:80',
    },
    appendPlugin: false,
  },
})
