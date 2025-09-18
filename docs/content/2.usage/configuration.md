# Configuration

The only **required** configuration option is `baseUrl` which will be used for API calls to your Laravel API, so you can start using the module with the following definition:

```typescript [nuxt.config.ts]
export default defineNuxtConfig({
    modules: ['nuxt-auth-sanctum'],

    sanctum: {
        baseUrl: 'http://localhost:80', // Laravel API
    },
});
```

### Available options

For any additional configurations, you can adjust the next list of available parameters:

| Parameter                            | Description                                                                                                                          | Default value            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| baseUrl                              | The base URL of the Laravel API                                                                                                      | undefined                |
| mode                                 | Authentication mode to work with Laravel API. Supported values - `cookie`, `token`.                                                  | cookie                   |
| origin                               | The URL of the current application to use in Referrer header                                                                         | `useRequestUrl().origin` |
| userStateKey                         | The key to use to store the user identity in the `useState` variable.                                                                | sanctum.user.identity    |
| redirectIfAuthenticated              | Determine whether to redirect the user if it is already authenticated on a login attempt.                                            | false                    |
| redirectIfUnauthenticated            | Determine whether to redirect when the user got unauthenticated on any API request.                                                  | false                    |
| endpoints.csrf                       | The endpoint to request a new CSRF token                                                                                             | `/sanctum/csrf-cookie`   |
| endpoints.login                      | The endpoint to send user credentials to authenticate                                                                                | `/login`                 |
| endpoints.logout                     | The endpoint to destroy current user session                                                                                         | `/logout`                |
| endpoints.user                       | The endpoint to fetch current user data                                                                                              | `/api/user`              |
| csrf.cookie                          | Name of the CSRF cookie to extract from server response                                                                              | XSRF-TOKEN               |
| csrf.header                          | Name of the CSRF header to pass from client to server                                                                                | X-XSRF-TOKEN             |
| client.retry                         | The number of times to retry a request when it fails                                                                                 | false                    |
| client.initialRequest                | Determines whether to request the user identity on plugin initialization                                                             | true                     |
| redirect.keepRequestedRoute          | Determines whether to keep the requested route when redirecting after login                                                          | false                    |
| redirect.onLogin                     | Route to redirect to when user is authenticated. If set to false, do nothing                                                         | `/`                      |
| redirect.onLogout                    | Route to redirect to when user is not authenticated. If set to false, do nothing                                                     | `/`                      |
| redirect.onAuthOnly                  | Route to redirect to when user has to be authenticated. If set to false, do nothing                                                  | `/login`                 |
| redirect.onGuestOnly                 | Route to redirect to when user has to be a guest. If set to false, do nothing                                                        | `/`                      |
| globalMiddleware.enabled             | Determines whether the global middleware is enabled                                                                                  | false                    |
| globalMiddleware.prepend             | Determines whether to allow 404 pages without authentication                                                                         | false                    |
| globalMiddleware.allow404WithoutAuth | Determines whether to allow 404 page without authentication                                                                          | true                     |
| logLevel                             | The level to use for the logger. More details [here](../advanced/logging.md).                                                        | 3                        |
| appendPlugin                         | Determines whether to append the plugin to the Nuxt application. More details [here](https://nuxt.com/docs/api/kit/plugins#options). | false                    |

For more details, please check the source code - [options.ts](https://github.com/manchenkoff/nuxt-auth-sanctum/blob/main/src/runtime/types/options.ts).

### Overrides

You can override any of these options in the `nuxt.config.ts` file:

```ts
export default defineNuxtConfig({
    modules: ['nuxt-auth-sanctum'],

    sanctum: {
        baseUrl: 'http://localhost:80', // Your Laravel API
        redirect: {
            onLogin: '/dashboard', // Custom route after successful login
        },
    },
});
```

### RuntimeConfig

Module configuration is exposed to `runtimeConfig` property of your Nuxt app, so you can override either in `sanctum` module config or `runtimeConfig.public.sanctum` property.

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

### Environment variables

It is possible to override options via environment variables too. It might be useful when you want to use `.env` file to provide `baseUrl` for Laravel API.

And here is what it will look like in `.env` file:

`NUXT_PUBLIC_SANCTUM_BASE_URL='http://localhost:80'`

### Configuration example

Here is an example of a full module configuration

```typescript
sanctum: {
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
        allow404WithoutAuth: true,
    },
    logLevel: 3,
    appendPlugin: false,
}
```
