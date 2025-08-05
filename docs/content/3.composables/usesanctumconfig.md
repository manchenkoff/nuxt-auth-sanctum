# useSanctumConfig

This composable provides quick access to the module configuration instead of using `useRuntimeConfig` and several keys like `public.sanctum`.&#x20;

Take a look at the following example

```ts
const config = useSanctumConfig();

console.log(config.baseUrl); // runtimeConfig.public.sanctum.baseUrl
```

More details about the configuration structure can be found [here](../usage/configuration.md).
