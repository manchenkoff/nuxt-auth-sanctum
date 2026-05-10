import { createPage, url, type NuxtPage } from '@nuxt/test-utils/e2e'
import { selectors } from './selectors'

export async function actAsGuest(route: string = '/'): Promise<NuxtPage> {
  const page = await createPage(url(route))

  return page
}

export async function actAsUser(route: string = '/'): Promise<NuxtPage> {
  const page = await createPage('/login')

  await page.fill(selectors.login.email, 'john@doe.com')
  await page.fill(selectors.login.password, 'password')

  await page.click(selectors.login.submit)
  await page.waitForURL('**/profile')

  await page.goto(url(route))

  return page
}
