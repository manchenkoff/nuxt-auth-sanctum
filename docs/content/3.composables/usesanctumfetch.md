# useSanctumFetch

Besides `useSanctumClient` you can directly send a request by using a module-specific version of fetch composable - `useSanctumFetch` .

This composable implements a similar interface to `useFetch`, so you can check more details [here](https://nuxt.com/docs/api/composables/use-fetch).

Composable accepts 3 arguments:

* endpoint URL to call
* `FetchOptions` to pass to the [Sanctum](usesanctumclient.md) client (`ofetch`)
* `AsyncDataOptions` to pass to `useAsyncData` under the hood

```ts [components/YourComponent.vue]
const { data, status, error, refresh } = await useSanctumFetch('/api/users');

// or

const { data, status, error, refresh } = await useSanctumFetch(
  '/api/users',
  {
    method: 'GET',
    query: {
      is_active: true,
    },
  },
  {
    pick: ['id'],
  },
);
```

You can also use type casting to work with response as an interface:

```typescript
interface MyResponse {
  name: string
}

const { data } = await useSanctumFetch<MyResponse>('/api/endpoint')

const name = data.value.name // augmented by MyResponse interface
```
