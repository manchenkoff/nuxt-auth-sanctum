import { setup, url } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { actAsGuest, actAsUser } from '../helpers/auth'

const
  FIXTURE_DIR = '../fixtures/cookie-global',
  FIXTURE_URL = new URL(FIXTURE_DIR, import.meta.url),
  FIXTURE_PORT = 3005

describe('global middleware', async () => {
  await setup({
    rootDir: fileURLToPath(FIXTURE_URL),
    port: FIXTURE_PORT,
    browser: true,
  })

  it('renders non-existent page without redirect', async () => {
    const page = await actAsGuest()

    await page.goto(url('/404'))

    expect(page.url()).toContain('/404')
  })

  it('renders page when sanctum.excluded=true', async () => {
    const page = await actAsGuest('/bye')

    expect(page.url()).toContain('/')
  })

  it('renders guest-only page when unauthenticated', async () => {
    const page = await actAsGuest()

    await page.goto(url('/login'))

    expect(page.url()).toContain('/login')
  })

  it('redirects from guest-only page when authenticated', async () => {
    const page = await actAsUser()

    await page.goto(url('/login'))

    expect(page.url()).not.toContain('/login')
  })

  it('renders secure page when authenticated', async () => {
    const page = await actAsUser()

    await page.goto(url('/profile'))

    expect(page.url()).toContain('/profile')
  })

  it('redirects from secure page when unauthenticated', async () => {
    const page = await actAsGuest()

    await page.goto(url('/profile'))

    expect(page.url()).toContain('/login?redirect=/profile')
  })
})
