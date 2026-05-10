import { setup, url } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { actAsGuest, actAsUser } from '../helpers/auth'

const
  FIXTURE_DIR = '../fixtures/cookie',
  FIXTURE_URL = new URL(FIXTURE_DIR, import.meta.url),
  FIXTURE_PORT = 3006

describe('route middleware', async () => {
  await setup({
    rootDir: fileURLToPath(FIXTURE_URL),
    port: FIXTURE_PORT,
    browser: true,
  })

  describe('sanctum:auth', () => {
    const secureRoute = '/profile'

    it('redirects when unauthenticated', async () => {
      const page = await actAsGuest()
      await page.goto(url(secureRoute))

      expect(page.url()).toContain('/login?redirect=/profile')
    })

    it('allows access when authenticated', async () => {
      const page = await actAsUser()
      await page.goto(url(secureRoute))

      expect(page.url()).toContain('/profile')
    })
  })

  describe('sanctum:guest', () => {
    const guestRoute = '/login'

    it('allows access when unauthenticated', async () => {
      const page = await actAsGuest()
      await page.goto(url(guestRoute))

      expect(page.url()).toContain('/login')
    })

    it('redirects when authenticated', async () => {
      const page = await actAsUser()
      await page.goto(url(guestRoute))

      expect(page.url()).not.toContain('/login')
    })
  })
})
