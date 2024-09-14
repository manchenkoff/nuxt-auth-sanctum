import type { ModuleOptions } from './runtime/types/options'

export const defaultModuleOptions: ModuleOptions = {
  baseUrl: 'http://localhost:80',
  mode: 'cookie',
  userStateKey: 'sanctum.user.identity',
  redirectIfAuthenticated: false,
  redirectIfUnauthenticated: false,
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
  appendPlugin: false,
}
