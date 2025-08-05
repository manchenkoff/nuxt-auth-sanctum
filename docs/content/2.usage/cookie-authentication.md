# Cookie Authentication

By default, the module provides configuration to integrate seamlessly with Laravel Sanctum authentication based on the XSRF token.

To explicitly set this authentication mode, update `sanctum.mode` configuration property to `cookie`.

You can check the official Laravel documentation here - [SPA Authentication](https://laravel.com/docs/11.x/sanctum#spa-authentication).

::warning
Nuxt and Laravel applications must share the same top-level domain.&#x20;

For instance:

* Nuxt application - **`domain.com`**
* Laravel application - **`api.domain.com`**
::

### How it works

First, you need to authenticate a user by submitting credentials to `endpoints.login` endpoint:

```typescript [components/LoginForm.vue]
const { login } = useSanctumAuth()

const credentials = {
    email: "john@doe.com",
    password: "password",
    remember: true,
}

await login(credentials)
```

The client will be automatically redirected to `redirect.onLogin` route of your application.

Once the module has an authentication state, it will take care of requesting a CSRF cookie from the API and passing it as an XSRF header to each subsequent request as well as passing all other headers and cookies from CSR to SSR requests.

You can also [extend default interceptors](../advanced/interceptors.md) and add your information into headers or cookie collections.

To check other available methods, please refer to the **composables** section.

### Laravel configuration

Your Laravel API should be configured properly to support Nuxt domain and share cookies:

* [ ] The Nuxt application domain should be registered in `stateful` domain list (`SANCTUM_STATEFUL_DOMAINS)`
* [ ] The Nuxt application domain should be registered in `config/cors.php` in `allowed_origins` domain list
* [ ] Also `config/cors.php` configuration should have `support_credentials=true`
* [ ] Sanctum `statefulApi` middleware should be enabled
* [ ] The top-level domain should be used for the session (`SESSION_DOMAIN=.domain.com`), or `localhost` during development (without port)

If you notice incorrect behavior of the module or authentication flow, feel free to [raise an issue](https://github.com/manchenkoff/nuxt-auth-sanctum/issues/new/choose)!
