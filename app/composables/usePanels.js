export function usePanels() {
  const leftOpen = ref(true)
  const rightOpen = ref(true)
  return { leftOpen, rightOpen }
}
