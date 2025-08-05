# useLazySanctumFetch

Besides `useSanctumClient` you can directly send a request by using a module-specific version of fetch composable - `useLazySanctumFetch` .

This composable implements a similar interface to `useLazyFetch`, so you can check more details [here](https://nuxt.com/docs/api/composables/use-fetch).

Composable accepts 3 arguments:

* endpoint URL to call
* `FetchOptions` to pass to the [Sanctum](usesanctumclient.md) client (`ofetch`)
* `AsyncDataOptions` to pass to `useAsyncData` under the hood

```ts [components/YourComponent.vue]
const { data, status, error, refresh } = await useLazySanctumFetch('/api/users');

// or

const { data, status, error, refresh } = await useLazySanctumFetch(
  '/api/users',
  {
    method: 'GET',
    query: { page: 1 }
  },
  {
    default() { 
      return { 
        data: [], 
        meta: {
          total: 0, 
          per_page: 0 
        } 
      }
    }
  },
);
```

You can also use type casting to work with response as an interface:

```typescript
interface MyResponse {
  name: string
}

const { data } = await useLazySanctumFetch<MyResponse>('/api/endpoint')

const name = data.value.name // augmented by MyResponse interface
```
