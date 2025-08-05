# sanctum:guest

### Description

This middleware checks if the user is not authenticated. If not, it will redirect a user to the page specified in the `redirect.onGuestOnly` option (default is `/`).

If there is no redirect rule the middleware will throw `403` error.

### Example

This is an example of middleware usage

```typescript [pages/login.vue]
<script lang="ts" setup>
definePageMeta({
    middleware: ['sanctum:guest'],
});
</script>

<template>
    <!-- Page for guests only -->
</template>

<style scoped></style>
```
