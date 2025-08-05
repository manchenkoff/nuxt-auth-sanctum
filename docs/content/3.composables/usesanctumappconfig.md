# useSanctumAppConfig

This composable provides quick access to the module configuration instead of using `useAppConfig().sanctum`.&#x20;

Take a look at the following example

```ts
const config = useSanctumAppConfig();

console.log(config.interceptors.onRequest); // appConfig.sanctum.interceptors.onRequest
```

More details about the configuration structure can be found [here](../usage/configuration.md).
