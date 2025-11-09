# Nuxt Auth Sanctum

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

This module provides a simple way to use Laravel Sanctum with Nuxt by leveraging cookies-based authentication. SSR-ready!

- [Documentation](https://sanctum.manchenkoff.me)
- [Features](#features)
- [Quick Setup](#quick-setup)

## Features

This module includes a range of features designed to streamline authentication:

- `useSanctumAuth` composable for easy access to the current user and authentication methods
- `useSanctumFetch` and `useLazySanctumFetch` to load data from your API
- Automated `CSRF` token header and cookie management
- Automated `Bearer` token header management
- Both `CSR` and `SSR` modes support
- Pre-configured middleware for pages that require authentication
- Cast current user information to any class you want
- Custom `request` and `response` interceptors
- Subscribe to `sanctum:*` hooks to react as you want
- Compatible with default Nuxt `ofetch` client
- TypeScript support
- ... and more, check the docs!

**Note:** Before using this module, please make sure that you have already configured Laravel Sanctum on your backend. You can find more information about Laravel Sanctum [here](https://laravel.com/docs/10.x/sanctum#spa-authentication).

Complete documentation - [Nuxt Auth Sanctum docs](https://sanctum.manchenkoff.me)

## Quick Setup

1. Add `nuxt-auth-sanctum` dependency to your project

```bash
npx nuxi@latest module add nuxt-auth-sanctum
```

2. Add any required configuration in your `nuxt.config.ts` file

```js
export default defineNuxtConfig({
  modules: ["nuxt-auth-sanctum"],

  sanctum: {
    baseUrl: "http://localhost:80", // Laravel API
  },
});
```

That's it! You can now use Nuxt Auth Sanctum in your Nuxt app ✨

For more details, check the documentation [here](https://sanctum.manchenkoff.me)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-auth-sanctum/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-auth-sanctum
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-auth-sanctum.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npm.chart.dev/nuxt-auth-sanctum
[license-src]: https://img.shields.io/npm/l/nuxt-auth-sanctum.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-auth-sanctum
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com

### Powered by

[![JetBrains logo.](https://resources.jetbrains.com/storage/products/company/brand/logos/jetbrains.svg)](https://jb.gg/OpenSource)
