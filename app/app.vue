<script setup>
const colorMode = useColorMode()
if (colorMode.preference === 'system') colorMode.preference = 'dark'

useHead({
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" }
  ],
  link: [
    { rel: "icon", href: "/favicon.ico" }
  ],
  htmlAttrs: {
    lang: "en"
  }
})
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
