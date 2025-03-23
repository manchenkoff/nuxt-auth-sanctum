---
description: Subscribe to hook and react to any error received from your Laravel API.
---

# sanctum:error

When you send a request to Laravel API using any available module's composable, it may return an error, such as 401, 419, 403, 404, etc.

{% hint style="success" %}
By default, `nuxt-auth-sanctum` will try to redirect a user if 401 is returned. Unless you disable this by setting `sanctum.redirectIfUnauthenticated` to `false` in your `nuxt.config.ts` file.
{% endhint %}

However, if you need more granular control over API errors, you can subscribe to the `sanctum:error` hook and process the HTTP response according to your requirements.

{% code title="plugins/sanctum-listener.ts" %}
```typescript
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('sanctum:error', (response) => {
    console.log('Sanctum error hook triggered', response)
  })
})
```
{% endcode %}

Here is what the hook looks like

```typescript
interface RuntimeNuxtHooks {
  /**
   * Triggers when receiving an error response.
   */
  'sanctum:error': (response: FetchResponse<any>) => HookResult
}
```
