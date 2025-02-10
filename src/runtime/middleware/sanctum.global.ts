import type { RouteLocationAsPathGeneric } from 'vue-router'
import { useSanctumConfig } from '../composables/useSanctumConfig'
import { useSanctumAuth } from '../composables/useSanctumAuth'
import { trimTrailingSlash } from '../utils/formatter'
import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to) => {
  const options = useSanctumConfig()
  const { isAuthenticated } = useSanctumAuth()

  const [homePage, loginPage] = [
    options.redirect.onGuestOnly,
    options.redirect.onAuthOnly,
  ]

  if (homePage === undefined || homePage === false) {
    throw new Error(
      'You must define onGuestOnly route when using global middleware.',
    )
  }

  if (loginPage === undefined || loginPage === false) {
    throw new Error(
      'You must define onAuthOnly route when using global middleware.',
    )
  }

  if (
    options.globalMiddleware.allow404WithoutAuth
    && to.matched.length === 0
  ) {
    return
  }

  if (to.meta.sanctum?.excluded === true) {
    return
  }

  const isPageForGuestsOnly
        = trimTrailingSlash(to.path) === loginPage
          || to.meta.sanctum?.guestOnly === true

  if (isAuthenticated.value) {
    if (isPageForGuestsOnly) {
      return navigateTo(homePage, { replace: true })
    }

    return
  }

  if (isPageForGuestsOnly) {
    return
  }

  const redirect: RouteLocationAsPathGeneric = { path: loginPage }

  if (options.redirect.keepRequestedRoute) {
    redirect.query = { redirect: trimTrailingSlash(to.fullPath) }
  }

  return navigateTo(redirect, { replace: true })
})
