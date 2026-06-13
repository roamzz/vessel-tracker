export function usePanels() {
  const leftOpen = ref(true)
  const rightOpen = ref(true)

  const onResize = () => {
    if (window.innerWidth < 640) {
      leftOpen.value = false
      rightOpen.value = false
    }
  }

  onMounted(() => {
    const w = window.innerWidth
    if (w < 768) {
      leftOpen.value = false
      rightOpen.value = false
    } else if (w < 1200) {
      rightOpen.value = false
    }
    window.addEventListener('resize', onResize)
  })

  onUnmounted(() => window.removeEventListener('resize', onResize))

  return { leftOpen, rightOpen }
}
