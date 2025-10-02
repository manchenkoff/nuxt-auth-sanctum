---
description: >-
  Subscribe to hook and react to any error thrown by ofetch client during the
  request.
---

# sanctum:error:request

When you send a request to the API, it could raise an exception even before reaching the remote server. For these cases, `ofetch` uses `onRequestError`. All these errors are available via `sanctum:error:request` hook.

```typescript [plugins/sanctum-listener.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('sanctum:error:request', (context) => {
    console.log('Sanctum request error hook triggered', context)
  })
})
```

Here is what the hook looks like

```typescript
interface RuntimeNuxtHooks {
  /**
   * Triggers when receiving an error on fetch request.
   */
  'sanctum:error:request': (context: FetchContext) => HookResult
}
```
