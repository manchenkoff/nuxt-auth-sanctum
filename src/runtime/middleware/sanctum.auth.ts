import type { RouteLocationAsPathGeneric } from 'vue-router'
import { useSanctumConfig } from '../composables/useSanctumConfig'
import { trimTrailingSlash } from '../utils/formatter'
import { defineNuxtRouteMiddleware, navigateTo, createError } from '#app'
import { isUserSessionActive } from '../utils/session'

export default defineNuxtRouteMiddleware(async (to) => {
  const options = useSanctumConfig()

  if (await isUserSessionActive()) {
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

  return navigateTo(redirect, { replace: true })
})
