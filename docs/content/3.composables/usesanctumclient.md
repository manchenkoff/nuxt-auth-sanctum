# useSanctumClient

All previous composables work on top of the `ofetch` client which can be used in your application as well. The client is pre-configured with `CSRF` token header and cookie management.

All requests will be sent to the `baseUrl` specified in the [Configuration](../usage/configuration.md) section.

```ts [components/YourComponent.vue]
const client = useSanctumClient();

const { data, status, error, refresh } = await useAsyncData('users', () =>
    client('/api/users')
);
```

Since `client` implements `$Fetch` interface, you can use it as a regular `ofetch` client. Check examples in the [ofetch documentation](https://github.com/unjs/ofetch?tab=readme-ov-file#%EF%B8%8F-create-fetch-with-default-options).
