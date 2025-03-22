export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('sanctum:error', (response) => {
    console.log('Sanctum error hook triggered', response)
  })
})
