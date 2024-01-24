# Nuxt Auth Sanctum

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

This module provides a simple way to use Laravel Sanctum with Nuxt by leveraging cookies-based authentication. SSR-ready!

## Features

-   `useSanctumAuth` composable for easy access to the current user and authentication methods
-   Automated `CSRF` token header and cookie management
-   Both `CSR` and `SSR` modes support
-   Pre-configured middleware for pages that require authentication
-   Cast current user information to any class you want
-   Compatible with default Nuxt `ofetch` client
-   TypeScript support

**Note:** Before using this module, please make sure that you have already configured Laravel Sanctum on your backend. You can find more information about Laravel Sanctum [here](https://laravel.com/docs/10.x/sanctum#spa-authentication).

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

## Usage

In this package you can find the following:

-   **composables**
    -   `useSanctumAuth` - provides access to the current user and authentication methods
    -   `useSanctumUser` - provides access to the current user
    -   `useSanctumClient` - provides access to the `ofetch` client with pre-configured `CSRF` token header and cookie management
-   **middleware**
    -   `sanctum:auth` - middleware for pages that require authenticated user
    -   `sanctum:guest` - middleware for pages that require guest user

### Composables

1. `useSanctumUser`

This composable provides access to the current authenticated user. It supports generic types, so you can get the user as any class you want.

```ts
interface MyCustomUser {
    id: number;
    login: string;
    custom_metadata: {
        group: string;
        role: string;
    };
}

const user = useSanctumUser<MyCustomUser>();
```

If there is no authenticated user, the composable will return `null`.

2. `useSanctumAuth`

Composable provides 2 computed properties and 3 methods:

-   `user` - current authenticated user (basically the same as `useSanctumUser`)
-   `isAuthenticated` - boolean flag indicating whether the user is authenticated or not
-   `login` - method for logging in the user
-   `logout` - method for logging out the user
-   `refreshIdentity` - method for manually re-fetching current authenticated user data

To authenticate a user you should pass credentials payload as an argument to the `login` method. The payload should contain all fields that are required by your Laravel Sanctum backend.

```ts
const { login } = useSanctumAuth();

const userCredentials = {
    email: 'user@mail.com',
    password: '123123',
};

await login(userCredentials);
```

If login operation was successful, the `user` property will be updated with the current user information returned by the Laravel API.

By default, methods will use the following Laravel endpoints:

-   `/login` to authenticate the user
-   `/logout` to log out the user
-   `/api/user` to get the current user information
-   `/sanctum/csrf-cookie` to get the `CSRF` token cookie

To change the default endpoints, please check the [Configuration](#configuration) section.

1. `useSanctumClient`

All previous composables work on top of the `ofetch` client which can be used in your application as well.
The client is pre-configured with `CSRF` token header and cookie management.

All requests will be sent to the `baseUrl` specified in the [Configuration](#configuration) section.

```ts
const client = useSanctumClient();

const { data, pending, error, refresh } = await useAsyncData('users', () =>
    client('/api/users')
);
```

Since `client` implements `$Fetch` interface, you can use it as a regular `ofetch` client.
Check examples in the [ofetch documentation](https://github.com/unjs/ofetch?tab=readme-ov-file#%EF%B8%8F-create-fetch-with-default-options).

### Middleware

1. `sanctum:auth`

This middleware checks if the user is authenticated. If not, it will redirect a user to the page specified in the `redirect.onAuthOnly` option (default is `/login`).

Also, you might want to remember what page the **user was trying to access** and redirect him back to that page after successful authentication. To do that, just enable the `redirect.keepRequestedRoute` option and it will be automatically stored in the URL for later redirect.

If there is no redirect rule the middleware will throw `403` error.

2. `sanctum:guest`

This middleware checks if the user is not authenticated. If not, it will redirect a user to the page specified in the `redirect.onGuestOnly` option (default is `/`).

If there is no redirect rule the middleware will throw `403` error.

### Configuration

Here is the full example of the default module configuration:

```ts
baseUrl: 'http://localhost:80', // Laravel API
origin: 'http://localhost:3000', // Nuxt app (required for CSRF cookie), by default uses `useRequestURL().origin`
userStateKey: 'sanctum.user.identity', // user state key for Vue `useState` composable
redirectIfAuthenticated: false, // Redirect to onLogin if already authenticated
endpoints: {
    csrf: '/sanctum/csrf-cookie', // CSRF cookie endpoint
    login: '/login', // Endpoint that accepts user credentials
    logout: '/logout', // Endpoint to destroy the current session
    user: '/api/user', // Endpoint that return current user information
},
csrf: {
    cookie: 'XSRF-TOKEN', // CSRF cookie name
    header: 'X-XSRF-TOKEN', // CSRF header name
},
client: {
    retry: false, // ofetch retry option (number | false)
},
redirect: {
    keepRequestedRoute: false, // Keep requested route in the URL for later redirect
    onLogin: '/', // Redirect to this page after successful login
    onLogout: '/', // Redirect to this page after successful logout
    onAuthOnly: '/login', // Redirect to this page if user is not authenticated
    onGuestOnly: '/', // Redirect to this page if user is authenticated
},
```

You can override any of these options in the `nuxt.config.ts` file:

```ts
export default defineNuxtConfig({
    modules: ['nuxt-auth-sanctum'],

    sanctum: {
        baseUrl: 'http://localhost:80', // Your Laravel API
        origin: 'http://localhost:3000', // Your Nuxt app
        redirect: {
            onLogin: '/dashboard', // Custom route after successful login
        },
    },
});
```

Also, it is possible to override options via environment variables. It might be useful when you want to use `.env` file to provide `baseUrl` for Laravel API.

```ts
export default defineNuxtConfig({
    modules: ['nuxt-auth-sanctum'],

    runtimeConfig: {
        public: {
            sanctum: {
                baseUrl: 'http://localhost:80',
            },
        },
    },
});
```

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
