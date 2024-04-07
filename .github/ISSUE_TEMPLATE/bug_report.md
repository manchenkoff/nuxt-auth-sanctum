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

-   Version: [e.g. 0.1.2]
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

-   Version: [e.g. 3.11.0]
-   Mode: [e.g. CSR, SSR]
-   Environment: [e.g. local, production]

**Laravel environment:**

-   Version: [e.g. 11.0.0]
-   Sanctum installed via Breeze: [ ]
-   [Checklist](https://manchenkoff.gitbook.io/nuxt-auth-sanctum/other/laravel-api) completed: [ ]
-   Session domain from your `config/session.php`: [e.g. `domain.test`]
-   List of stateful domains from your `config/sanctum.php`

```php
return [
    'stateful' => explode(
        ',',
        env(
            'SANCTUM_STATEFUL_DOMAINS',
            sprintf('%s','localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1')
        )
    ),
];
```

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
