import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [MyModule],

  runtimeConfig: {
    public: {
      sanctum: {
        baseUrl: 'http://localhost:80',
      },
    },
  },
})
