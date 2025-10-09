---
description: This module provides a simple way to use Laravel Sanctum with Nuxt. SSR-ready!
---

# Introduction

### Top Features

* `useSanctumAuth` composable for easy access to the current user and authentication methods
* `useSanctumFetch` and `useLazySanctumFetch` to load data from your API
* Automated `CSRF` token header and cookie management
* Automated `Bearer` token header management
* Both `CSR` and `SSR` modes support
* Pre-configured middleware for pages that require authentication
* Cast current user information to any class you want
* Custom request and response interceptors
* Subscribe to `sanctum:*` hooks to react as you want
* Compatible with default Nuxt `ofetch` client
* TypeScript support
* ... and more, check the docs!

::warning
**Note:** Before using this module, please ensure you have configured Laravel Sanctum on your backend. You can find more information about Laravel Sanctum [here](https://laravel.com/docs/10.x/sanctum#spa-authentication).
::

We recommend looking at our [breeze-nuxt](advanced/breeze-nuxt-template.md) template that works flawlessly with [breeze-api](https://github.com/manchenkoff/breeze-api) Laravel application.

### Support

If you use this module, please support me to help to maintain and improve it!

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me A Coffee" data-size="original">](https://www.buymeacoffee.com/manchenkoff)
