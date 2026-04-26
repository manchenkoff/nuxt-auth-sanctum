export const TEST_CONFIG = {
  BASE_URL: 'http://localhost:80',
  CUSTOM_BASE_URL: 'http://remote-host.dev',
  CUSTOM_ORIGIN: 'http://custom-origin.dev',
  CSRF_COOKIE_NAME: 'cookie_name',
  CSRF_HEADER_NAME: 'header_name',
  CSRF_ENDPOINT: '/api/token',
  AUTH_TOKEN: 'abc123token',
  CSRF_TOKEN: 'csrf-token-cookie-value',
  REDIRECT_LOGIN: '/login',
  REDIRECT_HOME: '/',
}

export const HTTP_METHODS_REQUIRING_CSRF = ['POST', 'PUT', 'PATCH', 'DELETE']

export const COMMON_HEADERS = {
  CONTENT_TYPE: 'content-type',
  AUTHORIZATION: 'authorization',
  ACCEPT: 'accept',
  COOKIE: 'cookie',
  USER_AGENT: 'user-agent',
  ORIGIN: 'origin',
  REFERER: 'referer',
  SET_COOKIE: 'set-cookie',
  ACCESS_CONTROL_ALLOW_CREDENTIALS: 'access-control-allow-credentials',
  ACCESS_CONTROL_ALLOW_ORIGIN: 'access-control-allow-origin',
}