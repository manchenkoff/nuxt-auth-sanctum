# useSanctumAuth

Composable provides 2 computed properties and 3 methods:

* `user` - currently authenticated user (basically the same as [useSanctumUser](usesantumuser.md))
* `isAuthenticated` - a boolean flag indicating whether the user is authenticated or not
* `login` - method for logging in the user
* `logout` - method for logging out the user
* `refreshIdentity` - method for manually re-fetching current authenticated user data

To authenticate a user you should pass the credentials payload as an argument to the `login` method. The payload should contain all fields required by your Laravel Sanctum backend.

```ts [components/LoginForm.vue]
const { login } = useSanctumAuth();

const userCredentials = {
    email: 'user@mail.com',
    password: '123123',
};

await login(userCredentials);
```

If the login operation was successful, the `user` property will be updated with the current user information returned by the Laravel API.

By default, methods will use the following Laravel endpoints:

* `/login` to authenticate the user
* `/logout` to log out the user
* `/api/user` to get the current user information
* `/sanctum/csrf-cookie` to get the `CSRF` token cookie

To change the default endpoints, please check the [Configuration](../usage/configuration.md) section.
