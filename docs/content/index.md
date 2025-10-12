---
seo:
  title: Nuxt - Laravel Sanctum
  description: This module provides a simple way to use Laravel Sanctum with Nuxt. SSR-ready!
---

::u-page-hero{class="dark:bg-gradient-to-b from-neutral-900 to-neutral-950"}
---
orientation: horizontal
---
#top
:hero-background

#title
Authenticate users [easily]{.text-primary}.

#description
The only module you need to set up Laravel Sanctum authentication for Nuxt application!

#links
  :::u-button
  ---
  to: /getting-started
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::

  :::u-button
  ---
  icon: i-simple-icons-github
  color: neutral
  variant: outline
  size: xl
  to: https://github.com/sponsors/manchenkoff?o=esb
  target: _blank
  ---
  Support project
  :::

  :::u-button
  ---
  icon: i-simple-icons-buymeacoffee
  color: neutral
  variant: outline
  size: xl
  to: https://buymeacoffee.com/manchenkoff
  target: _blank
  ---
  Buy me a coffee
  :::


#default
  :::prose-pre
  ---
  code: npx nuxi@latest module add nuxt-auth-sanctum
  filename: Install module
  ---

  ```bash
  npx nuxi@latest module add nuxt-auth-sanctum
  ```
  :::
::

::u-page-section{class="dark:bg-neutral-950"}
#title
Features

#links
  :::u-button
  ---
  color: neutral
  size: lg
  to: /getting-started
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  Explore Nuxt Laravel Sanctum
  :::

#features
  :::u-page-feature
  ---
  icon: i-lucide-cookie
  ---
  #title
  Cookie or Token

  #description
  Automated handling `CSRF` cookies and `Bearer` tokens for authentication
  :::

  :::u-page-feature
  ---
  icon: i-lucide-user-lock
  ---
  #title
  Focus on logic, authentication is on us

  #description
  We provide a lot of useful composables, middleware, fetch utilities, hooks and more...
  :::

  :::u-page-feature
  ---
  icon: i-lucide-layers
  ---
  #title
  CSR + SSR

  #description
  Module supports both client and server rendering!
  :::

  :::u-page-feature
  ---
  icon: i-simple-icons-typescript
  ---
  #title
  TypeScript

  #description
  Code of this module is written entirely in TypeScript and supports autocompletion
  :::

  :::u-page-feature
  ---
  icon: i-lucide-cog
  ---
  #title
  No complex configuration

  #description
  You literally can start using this module by just providing Laravel API URL
  :::

  :::u-page-feature
  ---
  icon: i-lucide-git-pull-request
  ---
  #title
  Open-source

  #description
  Source code is forever-free and open for contributions!
  :::
::

::u-page-section{class="dark:bg-gradient-to-b from-neutral-950 to-neutral-900"}
  :::u-page-c-t-a
  ---
  links:
    - label: Start authenticating
      to: '/getting-started'
      trailingIcon: i-lucide-arrow-right
    - label: View on GitHub
      to: 'https://github.com/manchenkoff/nuxt-auth-sanctum'
      target: _blank
      variant: subtle
      icon: i-simple-icons-github
  title: Ready to build?
  description: Authenticate users with Laravel, Sanctum and Nuxt today!
  class: dark:bg-neutral-950
  ---

  :stars-background
  :::
::

