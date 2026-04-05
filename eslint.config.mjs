import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt({
  rules: {
    "@stylistic/comma-dangle": "off",
    "@stylistic/brace-style": ["error", "1tbs"],
    "@stylistic/semi": "off",
    "@stylistic/quotes": ["error", "double"],
    "vue/max-attributes-per-line": "off",
    "vue/html-self-closing": "off",
    "vue/singleline-html-element-content-newline": "off"
  }
})
