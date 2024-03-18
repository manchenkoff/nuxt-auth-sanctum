export default defineNuxtConfig({
    modules: ['../src/module'],
    typescript: {
        strict: true,
        typeCheck: true,
    },
    ssr: true,
    devtools: { enabled: true },
});
