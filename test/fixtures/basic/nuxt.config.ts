export default defineNuxtConfig({
    modules: ['../../../src/module'],

    runtimeConfig: {
        public: {
            sanctum: {
                baseUrl: 'http://localhost:80',
            },
        },
    },
});
