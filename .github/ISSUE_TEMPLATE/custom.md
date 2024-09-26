---
name: Question
about: Choose this template if you have a question about the project or functionality
title: '[Question] Short description'
labels: investigate, question
assignees: manchenkoff
---

**What is your question?**

A clear and concise description of what you want to know.

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
-   Session domain from your `config/session.php`: `.domain.test`
-   List of stateful domains from your `config/sanctum.php`: `['domain.test', 'www.domain.test']`
