# useSanctumUser

This composable provides access to the current authenticated user. It supports generic types, so you can get the user as any class you want.

{% code fullWidth="false" %}
```ts
interface MyCustomUser {
    id: number;
    login: string;
    custom_metadata: {
        group: string;
        role: string;
    };
}

const user = useSanctumUser<MyCustomUser>();
```
{% endcode %}

If there is no authenticated user, the composable will return `null`.
