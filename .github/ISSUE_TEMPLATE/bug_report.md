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

**Screenshots**

If applicable, add screenshots to help explain your problem.

**Module information**

-   Version: <INSTALLED_MODULE_VERSION>
-   Complete configuration of `sanctum` from your `nuxt.config.ts`

```typescript
export default defineNuxtConfig({
    modules: ['nuxt-auth-sanctum'],

    sanctum: {
        baseUrl: 'http://localhost:80',
    },
});
```

**Nuxt environment:**

-   Version: <YOUR_NUXT_VERSION>
-   SSR Enabled: (yes / no)
-   Environment: (local / production)

**Laravel environment:**

-   Version: <YOUR_LARAVEL_VERSION>
-   Sanctum installed via Breeze: (yes / no)
-   [Checklist](https://manchenkoff.gitbook.io/nuxt-auth-sanctum/authentication/spa-cookie#laravel-configuration) completed: (yes / no)
-   Session domain from your `config/session.php`: `.domain.test`
-   List of stateful domains from your `config/sanctum.php`: `['domain.test', 'www.domain.test']`
-   CORS settings from your `config/cors.php`

```php
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

Add any other context about the problem here. For instance, you can attach the details about the request/response of the application or logs from the backend to make this problem easier to understand.
