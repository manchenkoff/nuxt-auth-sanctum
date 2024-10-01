import { useSanctumAuth } from '../composables/useSanctumAuth'
import { useSanctumConfig } from '../composables/useSanctumConfig'
import { defineNuxtRouteMiddleware, navigateTo, createError } from '#app'

export default defineNuxtRouteMiddleware(() => {
  const options = useSanctumConfig()
  const { isAuthenticated } = useSanctumAuth()

  if (!isAuthenticated.value) {
    return
  }

  const endpoint = options.redirect.onGuestOnly

  if (endpoint === undefined) {
    throw new Error('`sanctum.redirect.onGuestOnly` is not defined')
  }

  if (endpoint === false) {
    throw createError({ statusCode: 403 })
  }

  return navigateTo(endpoint, { replace: true })
})
