# useLazySanctumFetch

Besides `useSanctumClient` you can directly send a request by using a module-specific version of fetch composable - `useLazySanctumFetch` .

This composable implements the same interface as `useLazyFetch`, so you can check more details [here](https://nuxt.com/docs/api/composables/use-lazy-fetch).

{% code title="components/YourComponent.vue" fullWidth="false" %}
```ts
const { data, status, error, refresh } = await useLazySanctumFetch('/api/users');
```
{% endcode %}

You can also use type casting to work with response as an interface:

```typescript
interface MyResponse {
  name: string
}

const { data } = await useLazySanctumFetch<MyResponse>('/api/endpoint')

const name = data.value.name // augmented by MyResponse interface
```
