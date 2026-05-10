import { setup, url } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { actAsGuest, actAsUser } from '../helpers/auth'

const
  FIXTURE_DIR = '../fixtures/cookie',
  FIXTURE_URL = new URL(FIXTURE_DIR, import.meta.url),
  FIXTURE_PORT = 3004

describe('route middleware', async () => {
  await setup({
    rootDir: fileURLToPath(FIXTURE_URL),
    port: FIXTURE_PORT,
    browser: true,
    env: {
      NUXT_SANCTUM_REDIRECT_ON_AUTH_ONLY: false,
      NUXT_SANCTUM_REDIRECT_ON_GUEST_ONLY: false,
    },
  })

  describe('sanctum:auth', () => {
    const secureRoute = '/profile'

    it('throws error when unauthenticated', async () => {
      const page = await actAsGuest()

      await page.goto(url(secureRoute))

      const content = await page.content()

      expect(content).toContain('403')
    })
  })

  describe('sanctum:guest', () => {
    const guestRoute = '/login'

    it('throws error when authenticated', async () => {
      const page = await actAsUser()

      await page.goto(url(guestRoute))

      const content = await page.content()

      expect(content).toContain('403')
    })
  })
})
