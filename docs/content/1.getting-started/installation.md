---
title: Installation
description: Minimum required version of Nuxt - 3.12.0.
---

# Installation

### Install Nuxt module

You can use the following command to install the module and automatically register it in your `nuxt.config.ts` modules section

```bash
npx nuxi@latest module add nuxt-auth-sanctum
```

#### Required configuration

Once you have the module installed and registered, provide the main required configuration in `nuxt.config.ts` to get started

```typescript [nuxt.config.ts]
export default defineNuxtConfig({
    // nuxt-auth-sanctum options (also configurable via environment variables)
    sanctum: {
        baseUrl: 'http://localhost:80', // Laravel API
    },
});
```

That's it! You can now use Nuxt Auth Sanctum in your Nuxt app ✨

### Install package manually

Add `nuxt-auth-sanctum` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-auth-sanctum

# Using yarn
yarn add --dev nuxt-auth-sanctum

# Using npm
npm install --save-dev nuxt-auth-sanctum
```

#### Register module

Add `nuxt-auth-sanctum` to the `modules` section of `nuxt.config.ts`

```typescript [nuxt.config.ts]
export default defineNuxtConfig({
    modules: ['nuxt-auth-sanctum'],
});
```
