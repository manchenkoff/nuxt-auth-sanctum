---
description: Subscribe to hook and react to a successful user log out event.
---

# sanctum:logout

Subscribe to the `sanctum:logout` hook which triggers once the user is logged out and the identity reset is done.

{% code title="plugins/sanctum-listener.ts" %}
```typescript
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('sanctum:logout', () => {
    console.log('Sanctum logout hook triggered')
  })
})
```
{% endcode %}

Here is what the hook looks like

```typescript
interface RuntimeNuxtHooks {
 /**
  * Triggers when user successfully logs out.
  */
 'sanctum:logout': () => HookResult
}
```
