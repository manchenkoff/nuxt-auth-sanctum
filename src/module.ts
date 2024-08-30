import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
  addRouteMiddleware,
  useLogger,
} from '@nuxt/kit'
import { defu } from 'defu'
import { defaultModuleOptions } from './config'
import type { ModuleOptions } from './runtime/types/options'
import { registerTypeTemplates } from './templates'

const MODULE_NAME = 'nuxt-auth-sanctum'

export type ModulePublicRuntimeConfig = { sanctum: ModuleOptions }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: MODULE_NAME,
    configKey: 'sanctum',
    compatibility: {
      nuxt: '>=3.12.0',
    },
  },

  defaults: defaultModuleOptions,

  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    const sanctumConfig = defu(
      _nuxt.options.runtimeConfig.public.sanctum,
      _options,
    )

    _nuxt.options.build.transpile.push(resolver.resolve('./runtime'))
    _nuxt.options.runtimeConfig.public.sanctum = sanctumConfig

    const logger = useLogger(MODULE_NAME, {
      level: sanctumConfig.logLevel,
    })

    addPlugin(resolver.resolve('./runtime/plugin'))
    addImportsDir(resolver.resolve('./runtime/composables'))

    if (sanctumConfig.globalMiddleware.enabled) {
      addRouteMiddleware({
        name: 'sanctum:auth:global',
        path: resolver.resolve('./runtime/middleware/sanctum.global'),
        global: true,
      })

      logger.info('Sanctum module initialized with global middleware')
    }
    else {
      addRouteMiddleware({
        name: 'sanctum:auth',
        path: resolver.resolve('./runtime/middleware/sanctum.auth'),
      })
      addRouteMiddleware({
        name: 'sanctum:guest',
        path: resolver.resolve('./runtime/middleware/sanctum.guest'),
      })

      logger.info('Sanctum module initialized w/o global middleware')
    }

    registerTypeTemplates(resolver)
  },
})
