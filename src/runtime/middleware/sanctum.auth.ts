import type { RouteLocationAsPathGeneric } from 'vue-router'
import { useSanctumConfig } from '../composables/useSanctumConfig'
import { useSanctumUser } from '../composables/useSanctumUser'
import { trimTrailingSlash } from '../utils/formatter'
import { defineNuxtRouteMiddleware, navigateTo, createError } from '#app'
import { checkSession } from '../utils/session'

export default defineNuxtRouteMiddleware(async (to) => {
  const options = useSanctumConfig()
  const user = useSanctumUser()

  if (user.value !== null && await checkSession()) {
    return
  }

  const endpoint = options.redirect.onAuthOnly

  if (endpoint === undefined) {
    throw new Error('`sanctum.redirect.onAuthOnly` is not defined')
  }

  if (endpoint === false) {
    throw createError({ statusCode: 403 })
  }

  const redirect: RouteLocationAsPathGeneric = { path: endpoint }

  if (options.redirect.keepRequestedRoute) {
    redirect.query = { redirect: trimTrailingSlash(to.fullPath) }
  }

  console.log(`Redirecting: ${redirect.path}`)

  return navigateTo(redirect, { replace: true })
})
