import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt({
  rules: {
    "@stylistic/comma-dangle": ["error", "never"],
    "@stylistic/brace-style": ["error", "1tbs"],
    "@stylistic/quotes": ["error", "double"]
  }
})
