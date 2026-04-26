import { describe, it, expect } from 'vitest'
import { defu } from 'defu'
import { defaultModuleOptions } from '../../src/config'
import type { ModuleOptions } from '../../src/runtime/types/options'

describe('default config', () => {
  it('should have correct default values for all config keys', () => {
    expect(defaultModuleOptions).toStrictEqual({
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
        initialRequest: true,
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
        prepend: false,
        allow404WithoutAuth: true,
      },
      logLevel: 3,
      appendPlugin: false,
      serverProxy: {
        enabled: false,
        route: '/api/sanctum',
        baseUrl: 'http://localhost:80',
      },
    })
  })
})

describe('config merging', () => {
  it('should merge user config with defaults', () => {
    const userConfig = {
      baseUrl: 'https://api.example.com',
      mode: 'token' as const,
      endpoints: {
        user: '/api/v2/user',
      },
      redirect: {
        onLogin: '/dashboard',
      },
    }

    const merged = defu(userConfig, defaultModuleOptions) as ModuleOptions

    expect(merged.baseUrl).toBe('https://api.example.com')
    expect(merged.mode).toBe('token')
    expect(merged.logLevel).toBe(defaultModuleOptions.logLevel)

    expect(merged.endpoints!.csrf).toBe(defaultModuleOptions.endpoints!.csrf)
    expect(merged.endpoints!.user).toBe('/api/v2/user')

    expect(merged.redirect!.onLogin).toBe('/dashboard')
    expect(merged.redirect!.onLogout).toBe(defaultModuleOptions.redirect!.onLogout)
  })
})

describe('type safety', () => {
  it('should accept valid mode values', () => {
    const cookieConfig: ModuleOptions = {
      ...defaultModuleOptions,
      mode: 'cookie',
    }
    expect(cookieConfig.mode).toBe('cookie')

    const tokenConfig: ModuleOptions = {
      ...defaultModuleOptions,
      mode: 'token',
    }
    expect(tokenConfig.mode).toBe('token')
  })

  it('should allow boolean redirect options', () => {
    const config: ModuleOptions = {
      ...defaultModuleOptions,
      redirect: {
        onLogin: false,
        onLogout: false,
        onAuthOnly: false,
        onGuestOnly: false,
        keepRequestedRoute: true,
      },
    }

    expect(config.redirect!.onLogin).toBe(false)
    expect(config.redirect!.onLogout).toBe(false)
  })
})
