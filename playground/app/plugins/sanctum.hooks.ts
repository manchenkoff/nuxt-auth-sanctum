export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('sanctum:error', (response) => {
    console.log('Sanctum error hook triggered', response)
  })

  nuxtApp.hook('sanctum:redirect', (url) => {
    console.log('Sanctum redirect hook triggered', url)
  })

  nuxtApp.hook('sanctum:init', () => {
    console.log('Sanctum init hook triggered')
  })

  nuxtApp.hook('sanctum:refresh', () => {
    console.log('Sanctum refresh hook triggered')
  })

  nuxtApp.hook('sanctum:login', () => {
    console.log('Sanctum login hook triggered')
  })
})
