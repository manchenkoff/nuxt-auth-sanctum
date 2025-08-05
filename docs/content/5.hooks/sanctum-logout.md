---
description: Subscribe to hook and react to a successful user log out event.
---

# sanctum:logout

Subscribe to the `sanctum:logout` hook which triggers once the user is logged out and the identity reset is done.

```typescript [plugins/sanctum-listener.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('sanctum:logout', () => {
    console.log('Sanctum logout hook triggered')
  })
})
```

Here is what the hook looks like

```typescript
interface RuntimeNuxtHooks {
 /**
  * Triggers when user successfully logs out.
  */
 'sanctum:logout': () => HookResult
}
```
