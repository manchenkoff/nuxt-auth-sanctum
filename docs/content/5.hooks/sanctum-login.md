---
description: Subscribe to hook and react to a successful user log in event.
---

# sanctum:login

Subscribe to the `sanctum:login` hook which triggers once the user is logged in and the identity refresh request is completed.

```typescript [plugins/sanctum-listener.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('sanctum:login', () => {
    console.log('Sanctum login hook triggered')
  })
})
```

Here is what the hook looks like

```typescript
interface RuntimeNuxtHooks {
 /**
  * Triggers when user successfully logs in.
  */
 'sanctum:login': () => HookResult
}
```
