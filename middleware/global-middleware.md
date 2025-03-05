# Global middleware

### Description

Instead of usage `sanctum:auth` and `sanctum:guest` on each page, you can enable global middleware that checks every route and restricts unauthenticated access.

The behavior of this middleware is the same as [**global** middleware](https://nuxt.com/docs/guide/directory-structure/middleware) in Nuxt applications.

{% hint style="warning" %}
Once global middleware is enabled, you can no longer use `sanctum:auth` and `sanctum:guest` on your pages.
{% endhint %}

### Configuration

To enable middleware, use the following configuration in your `nuxt.config.ts`

{% code title="nuxt.config.ts" fullWidth="false" %}
```typescript
sanctum: {
    baseUrl: 'http://localhost:80',
    redirect: {
        onAuthOnly: '/login',
        onGuestOnly: '/profile',
    },
    globalMiddleware: {
        enabled: true,
    },
}
```
{% endcode %}

Keep in mind, you **must define** `onAuthOnly` and `onGuestOnly` routes to help the plugin understand which page should be excluded from the middleware.

* **onAuthOnly** - this route is used to redirect unauthenticated users to let them log in, similar to `sanctum:auth` middleware
* **onGuestOnly** - this route is used to redirect already authenticated users, similar to `sanctum:guest` middleware

{% hint style="info" %}
You can also set `globalMiddleware.prepend` to `true` to load it before any other middleware.
{% endhint %}

### Exceptions

If you want to exclude an additional page besides `onAuthOnly` route, then you can define page metadata like in the example below:

{% code title="pages/about.vue" %}
```typescript
definePageMeta({
    sanctum: {
        excluded: true,
    }
});
```
{% endcode %}

This page will not be checked by global middleware regardless of user authentication status.

### Guest mode

Sometimes, you may have more than one page which are available only for unauthenticated users, for instance:

* "Sign up" page
* "Forgot my password" page

In these situations, you can use `sanctum.guestOnly` property of the page meta:

{% code title="pages/password-reset.vue" %}
```typescript
definePageMeta({
    sanctum: {
        guestOnly: true,
    }
});
```
{% endcode %}

{% hint style="warning" %}
Keep in mind, that those pages still will be handled by global middleware to check the user authentication state, so for public pages, it is still better to use `sanctum.excluded` to speed up the loading process.
{% endhint %}

### Non-existing routes

By default, when a user requests a non-existing route an error page will be thrown with 404 status, but you can also enable redirect to `onAuthOnly` instead by setting `allow404WithoutAuth` to `false`.

{% code title="nuxt.config.ts" %}
```typescript
sanctum: {
    baseUrl: 'http://localhost:80',
    redirect: {
        onAuthOnly: '/login',
        onGuestOnly: '/profile',
    },
    globalMiddleware: {
        enabled: true,
        allow404WithoutAuth: false,
    },
}
```
{% endcode %}
