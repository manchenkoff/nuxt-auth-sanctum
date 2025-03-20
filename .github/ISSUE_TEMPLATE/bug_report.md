---
name: Bug report
about: Create a report for a bug or incorrect behavior of the project
title: '[Bug] Short description'
labels: bug
assignees: manchenkoff
---

## Please, make sure that you have checked our [troubleshooting](https://manchenkoff.gitbook.io/nuxt-auth-sanctum/advanced/troubleshooting) guide before creating an issue.

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

**Logs**

Please provide module logs that can help to understand the problem. 
Make sure to change `sanctum.logLevel` to `5` in your `nuxt.config.ts`. 
CSR logs can be found in the browser, while SSR logs can be found in the server terminal.

```log
# REPLACE WITH YOUR LOGS!
```

**Additional context**

Add any other context about the problem here. 
For instance, you can attach the details about the request/response of the application or logs from the backend to make this problem easier to understand. 
Also, any code sample that can help to reproduce the issue will be appreciated.
