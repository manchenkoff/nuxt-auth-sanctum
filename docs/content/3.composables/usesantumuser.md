# useSanctumUser

This composable provides access to the current authenticated user. It supports generic types, so you can get the user as any class you want.

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

If there is no authenticated user, the composable will return `null`.
