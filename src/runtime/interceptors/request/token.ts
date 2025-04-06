import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import { useSanctumAppConfig } from '../../composables/useSanctumAppConfig'
import { useSanctumConfig } from '../../composables/useSanctumConfig'
import type { NuxtApp } from '#app'

const AUTHORIZATION_HEADER = 'Authorization'

/**
 * Sets the authentication Bearer token in the request header
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export async function setTokenHeader(
  app: NuxtApp,
  ctx: FetchContext,
  logger: ConsolaInstance,
): Promise<void> {
  const config = useSanctumConfig()

  if (config.mode !== 'token') {
    return
  }

  const appConfig = useSanctumAppConfig()

  if (appConfig.tokenStorage === undefined) {
    throw new Error('`sanctum.tokenStorage` is not defined in app.config.ts')
  }

  const token = await appConfig.tokenStorage.get(app)

  if (!token) {
    logger.debug('[request] authentication token is not set in the storage')
    return
  }

  const bearerToken = `Bearer ${token}`

  ctx.options.headers.set(AUTHORIZATION_HEADER, bearerToken)

  logger.debug(`[request] added ${AUTHORIZATION_HEADER} token header`)
}
