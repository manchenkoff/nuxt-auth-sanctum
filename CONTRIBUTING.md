# How to contribute

Please follow the guidelines below if you want to contribute to the project.

If you are working on a new feature, please create an issue on GitHub first. This will help us to understand what you are working on and to avoid duplication of work.

# Development environment

You can clone the repo by running the following command:

```bash
git clone git@github.com:manchenkoff/nuxt-auth-sanctum.git
```

Then you should create a new branch with the following name convention:

```bash
git checkout -b XXX-feature-name
```

Where `XXX` is the issue number on the GitHub.

## Install dependencies

To setup the development environment, you should install the dependencies first. You can do this by running the following command:

```bash
pnpm install
```

Then you can start dev server to see the playground app:

```bash
pnpm dev
```

Or if you want to build the project, you can run one of the following commands:

```bash
# Generate type stubs
pnpm dev:prepare

# Build the playground
pnpm dev:build
```

# Testing process

To test playground app you need to have a Laravel API running with Sanctum package installed.

if there are tests for the feature you are working on, you can run them by executing one of the following commands:

```bash
# Run Vitest
pnpm test

# Run Vitest in watch mode
pnpm test:watch
```

# Testing package locally

If you want to test the package before publishing it to `npm`, 
you can create an archive and install it as a dependency in your project.

To do this, run the following command:

```bash
pnpm rc
```

This will create a `.tgz` file in the `dist` directory. You can then reference it in your project:

```json
{
  "devDependencies": {
    "nuxt-auth-sanctum": "file:/dist/nuxt-auth-sanctum-0.0.0.tgz"
  }
}
```

Then you can install the package by running:

```bash
pnpm install
```

# Code Style and Standards

This project uses ESLint to enforce code style and standards. Please make sure to run the following commands before creating a pull request:

```bash
# Run ESLint
pnpm lint

# Run Nuxt type check
pnpm test:types

# Run Vitest
pnpm test
```

# Releasing

Once all the changes are merged into main branch, run the following command to release a new version:

```bash
pnpm release
```

# Code of Conduct

All contributors are expected to adhere to the [Code of Conduct](CODE_OF_CONDUCT.md). Please read it.

# Get in touch

If you have any questions or need help, feel free to reach out via artem@manchenkoff.me or by opening a new issue on Github.
