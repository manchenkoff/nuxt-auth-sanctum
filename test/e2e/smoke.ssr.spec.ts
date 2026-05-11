import { setup, url, waitForHydration, createPage } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import { describe, it } from 'vitest'
import { expect } from '@playwright/test'

const
  FIXTURE_DIR = '../fixtures/cookie',
  FIXTURE_URL = new URL(FIXTURE_DIR, import.meta.url),
  FIXTURE_PORT = 3007

describe('General smoke tests', async () => {
  await setup({
    rootDir: fileURLToPath(FIXTURE_URL),
    port: FIXTURE_PORT,
    browser: true,
  })

  it('deduplicates API requests and maintains hydration consistency', async () => {
    const messages: string[] = []

    const page = await createPage(url('/ping'))
    page.on('console', msg => messages.push(msg.text()))

    const ssrValue = await page.locator('#ping-value').textContent()
    expect(ssrValue).toBeTruthy()

    await waitForHydration(page, '/ping')

    const csrValue = await page.locator('#ping-value').textContent()
    expect(csrValue).toBe(ssrValue)

    const hydrationWarnings = messages.filter(m => m.toLowerCase().includes('hydrat'))
    expect(hydrationWarnings).toHaveLength(0)
  })
})
