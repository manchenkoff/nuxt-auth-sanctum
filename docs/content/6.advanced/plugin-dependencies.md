---
description: >-
  This page describes the module's behavior and its plugin in terms of handling
  dependencies for the requests.
---

# Plugin dependencies

Sometimes you might need to use other plugins while making requests against your Laravel API, for instance - `i18n` headers enrichment on each sanctum fetch request like this:

```typescript [app.config.ts]
export default defineAppConfig({
  sanctum: {
    interceptors: {
      onRequest: (app: NuxtApp, ctx: FetchContext, logger: ConsolaInstance) => {
        ctx
          .options
          .headers
          .set("X-Language", app.$i18n.localeProperties.value.code)
      },
    },
  },
})
```

Since this module cannot know about its dependencies in your application, you should use one of the following approaches to configure this behavior:

* use `sanctum.appendPlugin` to register the Sanctum client plugin only after previous modules are registered already
* disable an automatic initial user request and call it from your custom plugin with a properly set list of dependencies

### Append plugin

By default, all Nuxt plugins registered by the module use `prepend` operation on a list of plugins which makes it load before other plugins.

To change this behavior, you can set the `sanctum.appendPlugin` config key to `true` and see that the sanctum plugin will be registered after most of the plugins from other modules. This is done by using `append` operation instead of `prepend` on the list of plugins.

For more details, please check Nuxt documentation [here](https://nuxt.com/docs/api/kit/plugins#options).

### Manual initial identity request

Even after changing the loading order of the plugin, there might be some cases when you need more granular control of the execution flow of the initial identity requests.

For these kinds of situations, you should disable a plugin initialization request by setting `sanctum.client.initialRequest` to `false` and use it in your custom plugin like this:

```typescript [plugins/custom-auth.ts]
export default defineNuxtPlugin({
  name: 'custom-auth',
  dependsOn: ['@nuxtjs/i18n', 'nuxt-auth-sanctum'],
  async setup() {
    const { init } = useSanctumAuth()
    await init()
  }
})
```

This approach can guarantee that the user's identity will be requested with all dependent plugins loaded properly.

::warning
Beware, in the case of using a custom plugin for identity initial requests, you will have to handle API errors on your own (e.g. 401, 419) due to missing CSRF cookie values.

You can check the default implementation for reference - [identity request error handling](https://github.com/manchenkoff/nuxt-auth-sanctum/blob/main/src/runtime/plugin.ts#L62).
::
