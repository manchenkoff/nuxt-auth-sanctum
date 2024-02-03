---
description: >-
  Error handling of API responses is not a part of this module since the main
  goal is to provide an authentication layer and configured API client, but on
  this page, you can find useful hints.
---

# Error handling

When Laravel returns an error of any kind (_403, 404, 500, etc_), the module will throw this as an exception that has a generic `Error` type.&#x20;

### Error type check

This is how you can check what type of error you received

```typescript
import { FetchError } from 'ofetch';

const { login } = useSanctumAuth();

const userCredentials = {
    email: 'user@mail.com',
    password: '123123',
};

async function onCredentialsFormSubmit() {
    try {
        await login(userCredentials);
    } catch (e) {
        if (error instanceof FetchError && error.response?.status === 422) {
           // here you can extract errors from a response 
           // and put it in your form for example
           console.log(e.response?._data.errors)
        }
    }
}
```

Sometimes, it is not convenient, especially when it comes to validation errors in plenty of forms and components.&#x20;

### Error helper

Here you can get inspiration from error handling specifically for this case and implement it your way.

Create a new composable `useApiError` with the following content:

{% code title="composables/useApiError.ts" %}
```typescript
import { FetchError } from 'ofetch';

const VALIDATION_ERROR_CODE = 422;
const SERVER_ERROR_CODE = 500;

export const useApiError = (error: any) => {
    const isFetchError = error instanceof FetchError;
    const isValidationError =
        isFetchError && error.response?.status === VALIDATION_ERROR_CODE;

    const code = isFetchError ? error.response?.status : SERVER_ERROR_CODE;
    const bag: Record<string, string[]> = isValidationError
        ? error.response?._data.errors
        : {};

    return {
        isValidationError,
        code,
        bag,
    };
};
```
{% endcode %}

Use it as in the next example to extract all the errors from the response and handle it according to your logic:

```typescript
try {
    await login(credentials);
} catch (e) {
    const error = useApiError(e);

    if (error.isValidationError) {
        form.setErrors(error.bag);

        return;
    }

    console.error('Request failed not because of a validation', error.code);
}
```

Have a good debugging! 😎