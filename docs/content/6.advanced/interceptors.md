---
description: >-
  Here you can find the details about the usage of custom interceptors for the
  fetch client used for API calls.
---

# Interceptors

Interceptors allow you to define custom functions that will be used by [sanctumClient](../composables/usesanctumclient.md) during API calls. Here are some examples of what you can do with it:

* Add custom headers to all requests (e.g. `X-Localization`, `Accept-Language`, etc)
* Use telemetry or logging for requests/responses
* Modify request payload before sending

If you are not familiar with [ofetch](https://github.com/unjs/ofetch) interceptors, check [this documentation](https://github.com/unjs/ofetch?tab=readme-ov-file#%EF%B8%8F-interceptors) first.

### Configuration

Since `nuxt.config.ts` does not support complex TypeScript types like functions due to hydration, you have to use `app.config.ts` file to define your interceptors.

Here is an example of the configuration that writes a log entry for each request and response:

```typescript [app.config.ts]
import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'

export default defineAppConfig({
  sanctum: {
    interceptors: {
      onRequest: async (
        app: NuxtApp,
        ctx: FetchContext,
        logger: ConsolaInstance,
      ) => {
        ctx
          .options
          .headers
          .set('X-Custom-Headers', 'custom-value')

        logger.debug(`[onRequest] custom interceptor (${ctx.request})`)
      },

      onResponse: async (
        app: NuxtApp,
        ctx: FetchContext,
        logger: ConsolaInstance,
      ) => {
        logger.debug(`[onResponse] custom interceptor (${ctx.request})`)
      },
    },
  },
})
```

Each interceptor receives 3 arguments:

1. `app` - an instance of the current `NuxtApp`
2. `ctx` - `FetchContext` instance for the current operation with access to request, response, and options (_query, headers, etc_)
3. logger - an instance of a Consola logger used by the module (_will be prefixed with `nuxt-auth-sanctum`_)
