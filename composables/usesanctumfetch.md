# useSanctumFetch

Besides `useSanctumClient` you can directly send a request by using a module-specific version of fetch composable - `useSanctumFetch` .

This composable implements the same interface as `useFetch`, so you can check more details [here](https://nuxt.com/docs/api/composables/use-fetch).

{% code title="components/YourComponent.vue" fullWidth="false" %}
```ts
const { data, status, error, refresh } = await useSanctumFetch('/api/users');
```
{% endcode %}

You can also use type casting to work with response as an interface:

```typescript
interface MyResponse {
  name: string
}

const { data } = await useSanctumFetch<MyResponse>('/api/endpoint')

const name = data.value.name // augmented by MyResponse interface
```
