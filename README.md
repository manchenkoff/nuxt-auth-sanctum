# Nuxt Auth Sanctum

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

This module provides a simple way to use Laravel Sanctum with Nuxt by leveraging cookies-based authentication. SSR-ready!

-   [Documentation](https://manchenkoff.gitbook.io/nuxt-auth-sanctum/)
-   [Features](#features)
-   [Quick Setup](#quick-setup)
-   [Development](#development)

## Features

-   `useSanctumAuth` composable for easy access to the current user and authentication methods
-   Automated `CSRF` token header and cookie management
-   Both `CSR` and `SSR` modes support
-   Pre-configured middleware for pages that require authentication
-   Cast current user information to any class you want
-   Compatible with default Nuxt `ofetch` client
-   TypeScript support

**Note:** Before using this module, please make sure that you have already configured Laravel Sanctum on your backend. You can find more information about Laravel Sanctum [here](https://laravel.com/docs/10.x/sanctum#spa-authentication).

Complete documentation - [Nuxt Auth Sanctum docs](https://manchenkoff.gitbook.io/nuxt-auth-sanctum/).

## Quick Setup

1. Add `nuxt-auth-sanctum` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-auth-sanctum

# Using yarn
yarn add --dev nuxt-auth-sanctum

# Using npm
npm install --save-dev nuxt-auth-sanctum
```

2. Add `nuxt-auth-sanctum` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
    modules: ['nuxt-auth-sanctum'],

    // nuxt-auth-sanctum options (also configurable via environment variables)
    sanctum: {
        baseUrl: 'http://localhost:80', // Laravel API
        origin: 'http://localhost:3000', // Nuxt app, by default will be used 'useRequestURL().origin'
    },
});
```

That's it! You can now use Nuxt Auth Sanctum in your Nuxt app ✨

For more details, check the documentation [here](https://manchenkoff.gitbook.io/nuxt-auth-sanctum/).

## Development

```bash
# Install dependencies
yarn install

# Generate type stubs
yarn dev:prepare

# Develop with the playground
yarn dev

# Build the playground
yarn dev:build

# Run Prettier
yarn fmt

# Run ESLint
yarn lint

# Run Nuxt type check
yarn types

# Run Vitest
yarn test
yarn test:watch

# Release new version
yarn release
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-auth-sanctum/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-auth-sanctum
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-auth-sanctum.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-auth-sanctum
[license-src]: https://img.shields.io/npm/l/nuxt-auth-sanctum.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-auth-sanctum
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
