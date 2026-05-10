import { setup, waitForHydration } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import { describe, it } from 'vitest'
import { expect } from '@playwright/test'
import { actAsGuest, actAsUser } from '../helpers/auth'
import { selectors } from '../helpers/selectors'

const
  FIXTURE_DIR = '../fixtures/proxy',
  FIXTURE_URL = new URL(FIXTURE_DIR, import.meta.url),
  FIXTURE_PORT = 3002

describe('server proxy authentication flow', async () => {
  await setup({
    rootDir: fileURLToPath(FIXTURE_URL),
    port: FIXTURE_PORT,
    browser: true,
    env: {
      NUXT_SANCTUM_SERVER_PROXY_BASE_URL: `http://localhost:${FIXTURE_PORT}`,
    },
  })

  it('sets CSRF cookie on first load', async () => {
    const page = await actAsGuest()

    const cookies = await page.context().cookies()
    const csrfCookie = cookies.find(cookie => cookie.name === 'XSRF-TOKEN')

    expect(csrfCookie).toBeDefined()
    expect(page.url()).toContain('/')
  })

  it('returns error on incorrect credentials', async () => {
    const page = await actAsGuest('/login')

    await page.fill(selectors.login.email, 'john@doe.com')
    await page.fill(selectors.login.password, 'invalid-password')

    await page.click(selectors.login.submit)

    expect(page.url()).toContain('/login')
    expect(page.locator(selectors.login.error)).toBeVisible()
  })

  it('stores session and redirects on successful login', async () => {
    const page = await actAsGuest('/login')

    await page.fill(selectors.login.email, 'john@doe.com')
    await page.fill(selectors.login.password, 'password')

    await page.click(selectors.login.submit)
    await page.waitForURL('**/profile')

    expect(page.url()).toContain('/profile')

    const cookies = await page.context().cookies()
    const sessionCookie = cookies.find(cookie => cookie.name === 'laravel_session')

    expect(sessionCookie).toBeDefined()
  })

  it('keeps session active on page refresh', async () => {
    const page = await actAsGuest('/login')

    await page.fill(selectors.login.email, 'john@doe.com')
    await page.fill(selectors.login.password, 'password')

    await page.click(selectors.login.submit)
    await page.waitForURL('**/profile')

    expect(page.url()).toContain('/profile')

    await page.reload()
    await waitForHydration(page, '/profile')

    expect(page.url()).toContain('/profile')
  })

  it('destroys session and redirects on logout', async () => {
    const page = await actAsUser('/profile')

    await page.click(selectors.profile.logout)
    await page.waitForURL('**/bye')

    expect(page.url()).toContain('/bye')

    const cookies = await page.context().cookies()
    const sessionCookie = cookies.find(cookie => cookie.name === 'laravel_session')

    expect(sessionCookie).toBeUndefined()
  })
})
