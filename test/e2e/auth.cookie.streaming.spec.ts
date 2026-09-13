import { setup, waitForHydration } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import { describe, it } from 'vitest'
import { expect } from '@playwright/test'
import { actAsGuest, actAsUser } from '../helpers/auth'
import { selectors } from '../helpers/selectors'

const
  FIXTURE_DIR = '../fixtures/cookie-streaming',
  FIXTURE_URL = new URL(FIXTURE_DIR, import.meta.url),
  FIXTURE_PORT = 3008

describe('cookie authentication flow with SSR streaming enabled', async () => {
  await setup({
    rootDir: fileURLToPath(FIXTURE_URL),
    port: FIXTURE_PORT,
    browser: true,
  })

  it('renders the page and hydrates the client', async () => {
    const page = await actAsGuest('/')

    await waitForHydration(page, '/')

    expect(page.url()).toContain('/')
    expect(await page.locator('body').textContent()).toContain('page/index')
  })

  it('sets CSRF cookie on first load', async () => {
    const page = await actAsGuest('/')

    await waitForHydration(page, '/')

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

  it('fetches data from the API through SSR without crashing', async () => {
    const page = await actAsGuest('/ping')

    await waitForHydration(page, '/ping')
    await page.waitForSelector(selectors.ping.value)

    expect(page.url()).toContain('/ping')
    expect(await page.locator(selectors.ping.value).textContent()).toMatch(/\d+/)
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
