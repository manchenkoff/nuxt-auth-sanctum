export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('sanctum:error:response', (response) => {
    console.log('Sanctum error hook triggered', response)
  })

  nuxtApp.hook('sanctum:error:request', (context) => {
    console.log('Sanctum request error hook triggered', context)
  })

  nuxtApp.hook('sanctum:request', (nuxtApp, context, logger) => {
    logger.info('Sanctum request hook triggered', context.request)
  })

  nuxtApp.hook('sanctum:response', (nuxtApp, context, logger) => {
    logger.info('Sanctum response hook triggered', context.request)
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

  nuxtApp.hook('sanctum:logout', () => {
    console.log('Sanctum logout hook triggered')
  })
})
