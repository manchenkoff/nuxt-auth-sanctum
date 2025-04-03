# Changelog


## v0.6.2

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.6.1...v0.6.2)

### 🚀 Enhancements

- Return login response ([d341431](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/d341431))

### 🏡 Chore

- **deps-dev:** Bump @nuxt/devtools from 2.3.1 to 2.3.2 ([5d8442f](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/5d8442f))
- **deps-dev:** Bump vitest from 3.0.9 to 3.1.1 ([71f7049](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/71f7049))
- **deps-dev:** Bump @types/node from 22.13.13 to 22.13.16 ([4273f0f](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/4273f0f))

### ❤️ Contributors

- SwiTool <switooldev@gmail.com>

## v0.6.1

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.6.0...v0.6.1)

### 🚀 Enhancements

- **logs:** Added more details into logs for troubleshooting ([b7331c9](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/b7331c9))
- **tests:** Added test fixture project to simulate remote API ([27a7976](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/27a7976))

### 🩹 Fixes

- **init:** Use raw fetch to handle errors on identity init ([c1321bf](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/c1321bf))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](https://github.com/manchenkoff))

## v0.6.0

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.5.8...v0.6.0)

### 🚀 Enhancements

- **hooks:** Added sanctum:error hook ([413989f](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/413989f))
- **hooks:** Added sanctum:redirect hook ([c7bf355](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/c7bf355))
- **hooks:** Added sanctum:init and sanctum:refresh hooks ([fa5b592](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/fa5b592))
- **hooks:** Added sanctum:login hook ([ad67393](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/ad67393))
- **hooks:** Added sanctum:logout hook ([dd496cf](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/dd496cf))
- **fetch:** ⚠️  Support AsyncDataOptions in sanctum fetch composables ([9f23351](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/9f23351))

### 🏡 Chore

- Upgraded nuxt packages ([0df572b](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/0df572b))
- Upgraded changelogen package ([03c8b31](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/03c8b31))
- Added troubleshooting guide link ([2bd41a1](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/2bd41a1))
- Upgraded nuxt dependencies ([5a34273](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/5a34273))

#### ⚠️ Breaking Changes

- **fetch:** ⚠️  Support AsyncDataOptions in sanctum fetch composables ([9f23351](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/9f23351))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](https://github.com/manchenkoff))

## v0.5.8

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.5.7...v0.5.8)

### 🩹 Fixes

- Use unique key for sanctum fetch across csr/ssr ([0d43ea6](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/0d43ea6))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.5.7

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.5.6...v0.5.7)

### 🩹 Fixes

- Migrated from useFetch to useAsyncData ([79cb27d](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/79cb27d))

### 🏡 Chore

- Dependencies upgrade ([2bbe90c](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/2bbe90c))
- **dev-deps:** Upgraded dev dependencies ([6a629df](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/6a629df))
- **dev-deps:** Upgraded nuxt devtools ([bc3b601](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/bc3b601))
- **security:** Upgraded esbuild to avoid security issues ([82ad135](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/82ad135))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.5.6

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.5.5...v0.5.6)

### 🚀 Enhancements

- Added new composables to make requests ([a6bfc2f](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/a6bfc2f))

### 🩹 Fixes

- Added type hints for fetch composables ([bbb9e04](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/bbb9e04))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.5.5

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.5.4...v0.5.5)

### 🩹 Fixes

- Use npm keys in actions ([9bc984f](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/9bc984f))
- Deduplicate `set-cookie` headers on SSR response ([9d957e2](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/9d957e2))
- Downgraded typescript to fix module-builder ([f28daf8](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/f28daf8))

### 🏡 Chore

- **deps-dev:** Bump @nuxt/devtools from 1.6.4 to 1.7.0 ([b58ebc4](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/b58ebc4))
- **deps-dev:** Bump @nuxt/eslint-config from 0.7.3 to 0.7.4 ([0f79c42](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/0f79c42))
- **deps-dev:** Bump @typescript-eslint/eslint-plugin ([0cae715](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/0cae715))
- **deps-dev:** Bump @nuxt/schema from 3.14.1592 to 3.15.0 ([77c79f6](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/77c79f6))
- **deps-dev:** Bump @nuxt/test-utils from 3.15.1 to 3.15.4 ([2cc446b](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/2cc446b))
- **deps-dev:** Bump vitest in the npm_and_yarn group ([b64a354](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/b64a354))
- **deps-dev:** Bump @nuxt/schema from 3.15.2 to 3.15.4 ([c2dd453](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/c2dd453))
- **deps-dev:** Bump @nuxt/eslint-config from 0.7.4 to 1.0.0 ([a435516](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/a435516))
- Upgraded nuxt packages ([e0c5bb9](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/e0c5bb9))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.5.4

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.5.3...v0.5.4)

### 🩹 Fixes

- Use relative paths for injected types ([63696ff](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/63696ff))

### ❤️ Contributors

- Denis Mamaev ([@ExileofAranei](http://github.com/ExileofAranei))

## v0.5.3

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.5.2...v0.5.3)

### 🩹 Fixes

- Expose plugin name to be used in dependsOn ([c2d930b](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/c2d930b))

### 🏡 Chore

- **deps-dev:** Bump @nuxt/schema from 3.14.159 to 3.14.1592 ([83be062](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/83be062))
- **deps-dev:** Bump nuxt from 3.14.159 to 3.14.1592 ([0469f64](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/0469f64))
- **deps-dev:** Bump @typescript-eslint/eslint-plugin ([f619be8](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/f619be8))
- **deps-dev:** Bump eslint from 9.15.0 to 9.16.0 ([464c8ed](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/464c8ed))
- **deps-dev:** Bump @nuxt/eslint-config from 0.7.0 to 0.7.2 ([38c1c46](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/38c1c46))
- **deps-dev:** Bump @nuxt/devtools from 1.6.1 to 1.6.3 ([31a8027](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/31a8027))
- **deps-dev:** Bump @typescript-eslint/eslint-plugin ([1d47a17](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/1d47a17))
- **deps-dev:** Bump vitest from 2.1.5 to 2.1.8 ([63fa544](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/63fa544))
- **deps-dev:** Bump @nuxt/test-utils from 3.14.4 to 3.15.1 ([7c21b35](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/7c21b35))
- **deps-dev:** Bump @types/node from 22.10.1 to 22.10.2 ([b1d429b](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/b1d429b))
- **deps-dev:** Bump @typescript-eslint/eslint-plugin ([3067b61](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/3067b61))
- **deps-dev:** Bump eslint from 9.16.0 to 9.17.0 ([ce17914](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/ce17914))
- **deps-dev:** Bump @nuxt/eslint-config from 0.7.2 to 0.7.3 ([2ff5e99](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/2ff5e99))
- Upgraded playground to nuxt v4 structure ([056b488](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/056b488))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.5.2

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.5.1...v0.5.2)

### 🩹 Fixes

- Support insecure cookies for auth token ([5e59064](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/5e59064))

### 🏡 Chore

- **deps-dev:** Bump @types/node from 22.7.7 to 22.8.1 ([979c480](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/979c480))
- **deps-dev:** Bump vue-tsc from 2.1.6 to 2.1.8 ([b3a6b5a](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/b3a6b5a))
- **deps-dev:** Bump vue-tsc from 2.1.8 to 2.1.10 ([73259c8](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/73259c8))
- **deps-dev:** Bump vitest from 2.1.3 to 2.1.4 ([ce299ac](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/ce299ac))
- **deps-dev:** Bump eslint from 9.13.0 to 9.14.0 ([2840859](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/2840859))
- **deps-dev:** Bump @nuxt/eslint-config from 0.6.0 to 0.6.1 ([5f4e34c](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/5f4e34c))
- **deps-dev:** Bump @types/node from 22.8.7 to 22.9.0 ([cbe9b6f](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/cbe9b6f))
- **deps-dev:** Bump nuxt from 3.13.2 to 3.14.159 ([79ccffc](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/79ccffc))
- **deps-dev:** Bump @nuxt/schema from 3.13.2 to 3.14.159 ([4dbd21a](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/4dbd21a))
- **deps-dev:** Bump vitest from 2.1.4 to 2.1.5 ([1bd218b](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/1bd218b))
- **deps-dev:** Bump @nuxt/eslint-config from 0.6.1 to 0.7.0 ([1303a9a](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/1303a9a))
- **deps-dev:** Bump eslint from 9.14.0 to 9.15.0 ([b71d6e8](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/b71d6e8))
- Install typescript-eslint with a fix ([0e6b0e5](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/0e6b0e5))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.5.1

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.5.0...v0.5.1)

### 🚀 Enhancements

- Add option to prepend the global middleware ([94c3346](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/94c3346))

### 🏡 Chore

- **deps-dev:** Bump eslint from 9.11.1 to 9.12.0 ([b593bd7](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/b593bd7))
- **deps-dev:** Bump @nuxt/test-utils from 3.14.2 to 3.14.3 ([e775417](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/e775417))
- **deps-dev:** Bump typescript from 5.5.4 to 5.6.3 ([0963a0b](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/0963a0b))
- **deps-dev:** Bump @nuxt/eslint-config from 0.5.7 to 0.6.0 ([c5bc900](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/c5bc900))
- Updated bug report issue template ([f8534f1](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/f8534f1))
- **deps-dev:** Bump @nuxt/test-utils from 3.14.3 to 3.14.4 ([e89441f](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/e89441f))
- **deps-dev:** Bump vitest from 2.1.2 to 2.1.3 ([e563484](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/e563484))
- **deps-dev:** Bump eslint from 9.12.0 to 9.13.0 ([412f36f](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/412f36f))

### ❤️ Contributors

- Jonian Guveli <jonian@hardpixel.eu>
- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.5.0

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.18...v0.5.0)

### 🚀 Enhancements

- ⚠️  Use ofetch as actual dependency ([07f0213](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/07f0213))

### 🩹 Fixes

- Expect object instead of headers to log ([aeeddb8](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/aeeddb8))

#### ⚠️ Breaking Changes

- ⚠️  Use ofetch as actual dependency ([07f0213](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/07f0213))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.18

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.17...v0.4.18)

### 🚀 Enhancements

- Improve headers logging readability ([8160e8c](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/8160e8c))

### 🩹 Fixes

- Use normalized Headers object for interceptors ([22602b6](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/22602b6))

### 🏡 Chore

- Use specific ofetch version for development ([6edf22d](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/6edf22d))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.17

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.16...v0.4.17)

### 🚀 Enhancements

- Added headers validation and more control on config values ([c08c778](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/c08c778))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.16

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.15...v0.4.16)

### 🩹 Fixes

- Prevent concurrent update of request headers ([c5af530](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/c5af530))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.15

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.14...v0.4.15)

### 🚀 Enhancements

- Add request and response headers logging ([fed1d16](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/fed1d16))

### 🩹 Fixes

- Prevent object merging with HeadersList ([393ddca](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/393ddca))

### 🏡 Chore

- **deps-dev:** Bump @nuxt/devtools from 1.5.0 to 1.5.1 ([c564ab3](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/c564ab3))
- **deps-dev:** Bump @types/node from 22.5.5 to 22.7.4 ([9a2f385](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/9a2f385))
- **deps-dev:** Bump eslint from 9.11.0 to 9.11.1 ([4b4ab3f](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/4b4ab3f))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.14

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.13...v0.4.14)

### 🩹 Fixes

- Use nuxt app context for default token storage ([1f7fdb2](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/1f7fdb2))

### 🏡 Chore

- Updated issue templates ([8647cdc](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/8647cdc))
- Updated bug report issue template ([fca3627](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/fca3627))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.13

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.12...v0.4.13)

### 🩹 Fixes

- Keep same session on SSR requests ([fc96f34](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/fc96f34))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.12

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.11...v0.4.12)

### 🚀 Enhancements

- Control plugin load order ([fa1e46d](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/fa1e46d))
- Control over initial user request ([5f3d8d4](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/5f3d8d4))

### 🏡 Chore

- **deps-dev:** Bump nuxt from 3.13.0 to 3.13.1 ([33e6323](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/33e6323))
- **deps-dev:** Bump @nuxt/eslint-config from 0.5.5 to 0.5.6 ([f88ecb9](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/f88ecb9))
- **deps-dev:** Bump vue-tsc from 2.1.4 to 2.1.6 ([11661f9](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/11661f9))
- **deps-dev:** Bump eslint from 9.9.1 to 9.10.0 ([95cd069](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/95cd069))
- **deps-dev:** Bump @nuxt/module-builder from 0.8.3 to 0.8.4 ([51fd807](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/51fd807))
- **deps-dev:** Bump @types/node from 22.5.2 to 22.5.5 ([abe3846](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/abe3846))
- **deps-dev:** Bump vitest from 2.0.5 to 2.1.1 ([bbcb244](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/bbcb244))
- Upgraded nuxt dependencies ([6b28a2a](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/6b28a2a))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.11

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.10...v0.4.11)

### 🏡 Chore

- **deps-dev:** Bump vue-tsc from 2.1.2 to 2.1.4 ([35efc7b](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/35efc7b))
- **deps-dev:** Bump @types/node from 22.5.1 to 22.5.2 ([7a7e912](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/7a7e912))
- **deps-dev:** Bump @nuxt/eslint-config from 0.5.4 to 0.5.5 ([84e836d](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/84e836d))

### 🤖 CI

- Added prerelease pipeline ([deff64a](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/deff64a))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.10

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.9...v0.4.10)

### 🩹 Fixes

- Improved nullable schema fields ([879fdee](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/879fdee))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.9

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.8...v0.4.9)

### 🚀 Enhancements

- Simplified module config ([b3bad10](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/b3bad10))

### 🩹 Fixes

- Added augmented types for PageMeta ([e784f88](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/e784f88))

### 🏡 Chore

- Migrated from yarn to pnpm ([bad9820](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/bad9820))
- Simplified pull request template ([8f8955b](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/8f8955b))
- Applied eslint formatter ([1b2670d](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/1b2670d))

### 🤖 CI

- Upgraded pipelines to work with pnpm ([1a041da](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/1a041da))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.8

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.7...v0.4.8)

### 🩹 Fixes

- Update to latest `@nuxt/module-builder` ([fdeae82](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/fdeae82))

### ❤️ Contributors

- Daniel Roe ([@danielroe](http://github.com/danielroe))

## v0.4.7

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.6...v0.4.7)

### 🩹 Fixes

- Use new augmented types from nuxt 3.13 ([197f1c3](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/197f1c3))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.6

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.5...v0.4.6)

### 🩹 Fixes

- Do not trim single slash in the url ([81c87d0](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/81c87d0))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.5

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.4...v0.4.5)

### 🩹 Fixes

- Trim trailing slash on redirects ([d24014d](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/d24014d))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.4

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.3...v0.4.4)

### 🩹 Fixes

- Fallback to #app augmented type for page meta ([cbf8a6c](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/cbf8a6c))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.3

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.2...v0.4.3)

### 🩹 Fixes

- Use resolved path for augmented types when using pnpm ([050c006](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/050c006))

### 🏡 Chore

- Upgraded nuxt version ([0cd2d51](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/0cd2d51))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.2

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.1...v0.4.2)

### 🚀 Enhancements

- Configure redirect if unauthenticated ([9574818](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/9574818))

### 🩹 Fixes

- Use updated csrf token on first login ([14f5c63](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/14f5c63))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.1

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.4.0...v0.4.1)

### 🩹 Fixes

- Experimental support for cloudflare workers ([9146cba](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/9146cba))

### 🏡 Chore

- Updated github templates ([932fd0f](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/932fd0f))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.4.0

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.3.14...v0.4.0)

### 🚀 Enhancements

- ⚠️  Dropped support for excludeFromSanctum page meta ([5d09e71](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/5d09e71))
- Added token storage support ([2ebcfbf](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/2ebcfbf))

### 🏡 Chore

- Updated playgorund config to breeze-api ([5644023](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/5644023))
- Indicate compatibility with new v4 major ([54869f7](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/54869f7))

#### ⚠️ Breaking Changes

- ⚠️  Dropped support for excludeFromSanctum page meta ([5d09e71](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/5d09e71))

### ❤️ Contributors

- Daniel Roe ([@danielroe](http://github.com/danielroe))
- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.3.14

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.3.13...v0.3.14)

### 🩹 Fixes

- Changed path with typo ([1c9c963](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/1c9c963))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.3.13

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.3.12...v0.3.13)

### 🩹 Fixes

- Hardcode absolute path to node_modules for page meta ([eb0d555](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/eb0d555))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.3.12

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.3.11...v0.3.12)

### 🩹 Fixes

- Adjusted path for page meta type ([c0ddc35](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/c0ddc35))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.3.11

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.3.10...v0.3.11)

### 🩹 Fixes

- Expose page meta augmented type ([b49fdfb](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/b49fdfb))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.3.10

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.3.9...v0.3.10)

### 🩹 Fixes

- Removed workspace from dependencies ([a648ae9](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/a648ae9))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.3.9

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.3.8...v0.3.9)

### 🩹 Fixes

- Expose type via templates ([d1ed3a4](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/d1ed3a4))
- Export public runtime config as part of module ([43fd15c](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/43fd15c))

### 🏡 Chore

- Added typing for interceptors ([8446f6a](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/8446f6a))
- Added transpile build option ([40fe0b2](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/40fe0b2))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.3.8

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.3.7...v0.3.8)

### 🩹 Fixes

- Updated exporting nuxt schemas ([fa608f6](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/fa608f6))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.3.7

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.3.6...v0.3.7)

### 🩹 Fixes

- Use common request header ([2536f21](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/2536f21))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.3.6

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.3.5...v0.3.6)

### 🩹 Fixes

- Export module types ([b1a513b](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/b1a513b))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.3.5

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.3.4...v0.3.5)

### 🚀 Enhancements

- Added support for custom interceptors ([2795998](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/2795998))

### 🩹 Fixes

- Disabled typecheck in the playground ([cd77036](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/cd77036))

### 🏡 Chore

- Upgraded module build dependencies ([16cdde6](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/16cdde6))
- Extracted default module options ([e0f2c7a](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/e0f2c7a))
- Applied formatting to system files ([ae7918f](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/ae7918f))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.3.4

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.3.3...v0.3.4)

### 🩹 Fixes

- Dropped extenal cookie parser to use h3 ([1410179](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/1410179))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.3.3

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.3.2...v0.3.3)

### 🩹 Fixes

- Fixed cookie parses dependency ([bd6ef34](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/bd6ef34))

### 🏡 Chore

- Upgraded yarn to 4.2.2 ([007a7e4](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/007a7e4))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.3.2

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.3.1...v0.3.2)

### 🩹 Fixes

- Added github token for automatic release creation ([84fac56](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/84fac56))
- Request csrf only when not set ([569dbdc](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/569dbdc))
- Added csrf cookie for secure ssr calls ([8b45e06](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/8b45e06))

### 🏡 Chore

- Added debug log for user initial request ([409b3ae](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/409b3ae))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.3.1

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.3.0...v0.3.1)

### 🩹 Fixes

- Added npm credentials config ([51d76ef](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/51d76ef))
- Added id-token permission for pipeline ([72b08ea](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/72b08ea))
- Keep config type exported in composable ([3862bfb](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/3862bfb))

### 🏡 Chore

- Upgraded setup-node to v4 ([3f6226d](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/3f6226d))
- Removed temp pipeline for publishing ([3bd6027](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/3bd6027))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.3.0

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.2.3...v0.3.0)

### 🚀 Enhancements

- Added publish workflow ([3c8baef](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/3c8baef))
- ⚠️  Added guest mode for global middleware ([50f2a10](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/50f2a10))

### 🩹 Fixes

- Include history and write permissions in release pipeline ([220e16b](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/220e16b))

### 🏡 Chore

- **release:** V0.2.3 ([0397aa5](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/0397aa5))
- Dropped support of old versions ([8366255](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/8366255))

#### ⚠️ Breaking Changes

- ⚠️  Added guest mode for global middleware ([50f2a10](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/50f2a10))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.2.3

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.2.2...v0.2.3)

### 🩹 Fixes

- Resolved constant visibility issue ([5cbd7a3](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/5cbd7a3))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.2.2

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.2.0...v0.2.2)

### 🚀 Enhancements

- Added logger support ([9a62a8f](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/9a62a8f))
- Added logs into plugin ([79e2558](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/79e2558))

### 🩹 Fixes

- Remove git push with tags ([03b28d4](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/03b28d4))
- Prevent infinite redirect for guests ([20e7cc9](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/20e7cc9))
- Removed redundant empty line ([6426309](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/6426309))
- Reset user only when it expires ([d314b86](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/d314b86))
- Request identity once on plugin init ([c88fbdf](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/c88fbdf))
- Push main branch after bumping release version ([cc76b0e](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/cc76b0e))

### 📖 Documentation

- Use new `nuxi module add` command in installation ([d74c007](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/d74c007))
- Update second step ([93e365d](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/93e365d))

### 🏡 Chore

- **release:** V0.2.1 ([cf80175](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/cf80175))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))
- Daniel Roe ([@danielroe](http://github.com/danielroe))

## v0.2.1

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.2.0...v0.2.1)

### 🩹 Fixes

- Remove git push with tags ([03b28d4](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/03b28d4))
- Prevent infinite redirect for guests ([20e7cc9](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/20e7cc9))

### 📖 Documentation

- Use new `nuxi module add` command in installation ([d74c007](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/d74c007))
- Update second step ([93e365d](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/93e365d))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))
- Daniel Roe ([@danielroe](http://github.com/danielroe))

## v0.2.0

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.1.2...v0.2.0)

### 🚀 Enhancements

- Add Origin header to the request ([6387379](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/6387379))
- Added separate error page ([79ce7b2](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/79ce7b2))
- Implemented global middleware ([6322fd3](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/6322fd3))

### 🩹 Fixes

- Opt in to `import.meta.*` properties ([99e98c9](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/99e98c9))
- Prevent redirects to the same page ([01daa22](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/01daa22))
- Prevent redirect on 401 response from login page ([380d4a6](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/380d4a6))
- Removed mistaken command from contributing rules ([f4fbf82](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/f4fbf82))
- Adjusted tsc directories to check ([de23cbb](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/de23cbb))

### 📖 Documentation

- Added separate gitbook as module docs ([f7c4edc](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/f7c4edc))
- Added toc to readme ([497386b](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/497386b))

### 🏡 Chore

- **release:** V0.1.2 ([f23e51a](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/f23e51a))
- Code style improvements ([32b0a64](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/32b0a64))
- Simplified middleware checks ([1c186b9](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/1c186b9))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))
- Daniel Roe ([@danielroe](http://github.com/danielroe))

## v0.1.2

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.1.1...v0.1.2)

### 🩹 Fixes

- Added required config to fixture env ([09b621d](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/09b621d))
- Updated nuxt dependencies and fixed test behavior ([e06cb36](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/e06cb36))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.1.1

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.1.0...v0.1.1)

### 🩹 Fixes

- Dumped compatibility version to 3.9 ([1268ffc](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/1268ffc))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.1.0

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.0.17...v0.1.0)

### 🚀 Enhancements

- Upgraded nuxt dependencies ([2c82ae6](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/2c82ae6))
- Handle cookies in read-only mode ([632abab](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/632abab))

### 🩹 Fixes

- Remove redundant config from playground ([8288cc0](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/8288cc0))
- Revert nuxt 3.10 to 3.9 because of bugs ([1eb3f0a](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/1eb3f0a))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.0.17

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.0.16...v0.0.17)

## v0.0.16

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.0.15...v0.0.16)

### 🚀 Enhancements

- **origin:** Set to optional ([dfe0805](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/dfe0805))
- **origin:** Fix indent ([a50d2c7](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/a50d2c7))

### ❤️ Contributors

- Ugo Mignon <ugomignon@gmail.com>

## v0.0.14

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.0.13...v0.0.14)

### 🏡 Chore

- Test bundler module resolution ([4dc2cde](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/4dc2cde))

### ❤️ Contributors

- Daniel Roe <daniel@roe.dev>

## v0.0.13

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/list...v0.0.13)

### 🏡 Chore

- **release:** V0.0.12 ([8230041](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/8230041))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.0.12

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/list...v0.0.12)

## v0.0.11

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.0.10...v0.0.11)

## v0.0.10

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.0.9...v0.0.10)

## v0.0.9

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.0.8...v0.0.9)

## v0.0.8

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.0.7...v0.0.8)

## v0.0.7

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.0.6...v0.0.7)

## v0.0.6

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.0.5...v0.0.6)

### 🏡 Chore

- **release:** V0.0.5 ([d52546e](https://github.com/manchenkoff/nuxt-auth-sanctum/commit/d52546e))

### ❤️ Contributors

- Manchenkoff ([@manchenkoff](http://github.com/manchenkoff))

## v0.0.5

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.0.4...v0.0.5)

## v0.0.4

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.0.3...v0.0.4)

## v0.0.3

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.0.2...v0.0.3)

## v0.0.2

[compare changes](https://github.com/manchenkoff/nuxt-auth-sanctum/compare/v0.0.1...v0.0.2)

## v0.0.1

- Initial release
- Added first implementation of the module
- Added readme
- Published NPM package

