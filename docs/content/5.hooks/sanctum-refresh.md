---
description: Subscribe to hook and react to a subsequent user identity request.
---

# sanctum:refresh

When the authentication state changes (e.g. `onLogin`, `onLogout`), the module has to refresh the user identity.

Subscribe to the `sanctum:refresh` hook which triggers once the identity refresh request is completed.

```typescript [plugins/sanctum-listener.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('sanctum:refresh', () => {
    console.log('Sanctum refresh hook triggered')
  })
})
```

Here is what the hook looks like

```typescript
interface RuntimeNuxtHooks {
 /**
  * Triggers when user identity has been refreshed.
  */
 'sanctum:refresh': () => HookResult
}
```
