import { unref } from 'vue'
import { useSanctumUser } from '../composables/useSanctumUser'
import { useSanctumAppConfig } from '../composables/useSanctumAppConfig'
import { useCookie, useNuxtApp } from '#app'
import { useSanctumConfig } from '../composables/useSanctumConfig'

export async function checkSession() {
  const nuxtApp = useNuxtApp()
  const user = useSanctumUser()
  const options = useSanctumConfig()
  const appConfig = useSanctumAppConfig()

  if (options.mode === 'cookie') {
    const csrfToken = unref(
      useCookie(
        options.csrf.cookie!,
        { readonly: true, watch: false },
      ),
    )

    if (!csrfToken) {
      user.value = null
      return false
    }
  }

  if (options.mode === 'token') {
    const token = await appConfig.tokenStorage!.get(nuxtApp)

    if (!token) {
      user.value = null
      return false
    }
  }

  return true
}
