# Token Authentication

**Token-based authentication is not recommended for SPA applications**. Still, it might be useful when you cannot host it on the same TLD or have a mobile or desktop application built with Nuxt (e.g. based on Capacitor).

To explicitly set this authentication mode, update `sanctum.mode` configuration property to `token`.

You can check the official Laravel documentation here - [API Token Authentication](https://laravel.com/docs/11.x/sanctum#api-token-authentication).

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

To check other available methods, please refer to the **composables** section.

The module expects a plain token value in the response from the API that can be stored in cookies to be included in all subsequent requests as `Authorization` header.

You can also implement [your own token storage](../advanced/token-storage.md) if cookies are not supported, for example - _Capacitor, Ionic, LocalStorage, etc._

### Laravel configuration

Your API should have at least two endpoints for login and logout which are included in `api.php` routes, so make sure that you do not use the same endpoints as for cookie-based authentication (`web.php` routes) to avoid **CSRF token mismatch** errors.

```php [routes/api.php]
Route::middleware(['guest'])->post('/login', [TokenAuthenticationController::class, 'store']);
Route::middleware(['auth:sanctum'])->post('/logout', [TokenAuthenticationController::class, 'destroy']);
```

::warning
Keep in mind, that the domain where API requests are coming from should not be included in `SANCTUM_STATEFUL_DOMAINS` variable, otherwise you will get a **CSRF mismatch error**.
::

The login endpoint must return a JSON response that contains `token` key like this

```json
{
    "token": "<plain_token_value>"
}
```

Here you can find an example from official documentation - [Issue API Token](https://laravel.com/docs/11.x/sanctum#issuing-api-tokens).

The logout endpoint should revoke the current client token to avoid inconsistencies with your Nuxt application state, please check official documentation - [Revoke API Tokens](https://laravel.com/docs/11.x/sanctum#revoking-tokens).

::note
You can also try our API template with the already implemented authentication logic for both cookie and token approach - [breeze-nuxt](../advanced/breeze-nuxt-template.md).
::

### Custom token storage

Default token storage uses cookies to keep the API Authentication token and automatically load it for both CSR and SSR requests. However, you are free to define custom storage in your `app.config.ts` by implementing an interface.

Check this section for more details - [Token storage](../advanced/token-storage.md).
