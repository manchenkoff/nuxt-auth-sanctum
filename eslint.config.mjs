// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt(
  {
    features: {
      tooling: true,
      stylistic: true,
    },
    dirs: {
      src: ['./playground'],
    },
  },
  //
  {
    rules: {
      'vue/no-multiple-template-root': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
  //
  {
    ignores: ['docs/'],
  },
)
