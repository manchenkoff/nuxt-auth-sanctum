---
description: Subscribe to hook and react to any redirect made by the module.
---

# sanctum:redirect

The module can apply redirects in different situations, like `onLogin` or `onLogout` and you can subscribe to this event to keep track of any redirect happening before it is done.

Subscribe to the `sanctum:redirect` hook which receives the URL of the target path of a redirect.

```typescript [plugins/sanctum-listener.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('sanctum:redirect', (url) => {
    console.log('Sanctum redirect hook triggered', url)
  })
})
```

Here is what the hook looks like

```typescript
interface RuntimeNuxtHooks {
  /**
   * Triggers when user has been redirected.
   */
  'sanctum:redirect': (response: FetchResponse<any>) => HookResult
}
```
