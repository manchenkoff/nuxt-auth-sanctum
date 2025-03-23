export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('sanctum:error', (response) => {
    console.log('Sanctum error hook triggered', response)
  })

  nuxtApp.hook('sanctum:redirect', (url) => {
    console.log('Sanctum redirect hook triggered', url)
  })
})
