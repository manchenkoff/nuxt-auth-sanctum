---
name: Bug report
about: Create a report for a bug or incorrect behavior of the project
title: '[Bug] Short description'
labels: bug
assignees: manchenkoff
---

**Describe the bug**

A clear and concise description of what the bug is.

**To Reproduce**

Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**

A clear and concise description of what you expected to happen.

**Actual behavior**

A clear and concise description of what actually happened.

**Module information**

-   Version: `x.x.x`
-   Content of your `nuxt.config.ts`:

```typescript
// REPLACE WITH YOUR FILE CONTENT!
export default defineNuxtConfig({
    modules: ['nuxt-auth-sanctum'],

    sanctum: {
        baseUrl: 'http://localhost:80',
    },
});
```

**Nuxt environment:**

-   Version: `x.x.x`
-   SSR Enabled: **yes / no**
-   Environment: **local / production**

**Laravel environment:**

-   Version: `x.x.x`
-   Sanctum installed via Breeze: **yes / no**
-   [Checklist](https://manchenkoff.gitbook.io/nuxt-auth-sanctum/authentication/spa-cookie#laravel-configuration) completed: **yes / no**
-   What is your session domain in `config/session.php`: `<REPLACE_ME>`
-   What is your stateful domains in `config/sanctum.php`: `<REPLACE_ME>`
-   Content of `config/cors.php`:

```php
<?php
// REPLACE WITH YOUR FILE CONTENT!

return [
    'paths' => ['*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

**Additional context**

Add any other context about the problem here. 
For instance, you can attach the details about the request/response of the application or logs from the backend to make this problem easier to understand. 
Also, any code sample that can help to reproduce the issue will be appreciated.
