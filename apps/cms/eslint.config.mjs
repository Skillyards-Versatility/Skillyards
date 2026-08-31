import studio from '@sanity/eslint-config-studio'
import globals from 'globals'

export default [
  ...studio,
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
