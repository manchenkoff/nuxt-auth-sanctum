# sanctum:auth

### Description

This middleware checks if the user is authenticated. If not, it will redirect a user to the page specified in the `redirect.onAuthOnly` option (default is `/login`).

Also, you might want to remember what page the **user was trying to access** and redirect him back to that page after successful authentication. To do that, just enable the `redirect.keepRequestedRoute` option and it will be automatically stored in the URL for later redirect.

If there is no redirect rule the middleware will throw `403` error.

### Example

This is an example of middleware usage

```typescript
<script lang="ts" setup>
definePageMeta({
    middleware: ['sanctum:auth'],
});
</script>

<template>
    <!-- Page for authenticated users only -->
</template>

<style scoped></style>
```