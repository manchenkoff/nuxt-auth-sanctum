import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
  addRouteMiddleware,
  useLogger,
  addServerHandler,
} from '@nuxt/kit'
import { defu } from 'defu'
import { defaultModuleOptions } from './config'
import type { PublicModuleOptions, ModuleOptions } from './runtime/types/options'
import { registerTypeTemplates } from './templates'

const MODULE_NAME = 'nuxt-auth-sanctum'

export type ModuleRuntimeConfig = { sanctum: ModuleOptions }
export type ModulePublicRuntimeConfig = { sanctum: PublicModuleOptions }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: MODULE_NAME,
    configKey: 'sanctum',
  },

  defaults: defaultModuleOptions,

  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    const sanctumConfig = defu(
      _nuxt.options.runtimeConfig.public.sanctum,
      _options,
    )

    _nuxt.options.build.transpile.push(resolver.resolve('./runtime'))
    _nuxt.options.runtimeConfig.sanctum = sanctumConfig

    const publicSanctumConfig = { ...sanctumConfig }
    // @ts-expect-error force delete non-optional key
    delete publicSanctumConfig.serverProxy

    _nuxt.options.runtimeConfig.public.sanctum = publicSanctumConfig

    const logger = useLogger(MODULE_NAME, {
      level: sanctumConfig.logLevel,
    })

    addPlugin(resolver.resolve('./runtime/plugin'), { append: sanctumConfig.appendPlugin })
    addImportsDir(resolver.resolve('./runtime/composables'))

    if (sanctumConfig.globalMiddleware.enabled) {
      addRouteMiddleware({
        name: 'sanctum:auth:global',
        path: resolver.resolve('./runtime/middleware/sanctum.global'),
        global: true,
      }, {
        prepend: sanctumConfig.globalMiddleware.prepend,
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

    if (sanctumConfig.serverProxy.enabled) {
      addServerHandler({
        route: `${sanctumConfig.serverProxy.route}/**`,
        handler: resolver.resolve('./runtime/server/api/proxy'),
      })

      logger.info('Sanctum module initialized with server proxy')
    }

    registerTypeTemplates(resolver)
  },
})
