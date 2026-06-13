import { defineStore } from 'pinia'
import { fetchNews, mapNewsItem } from '~/services/newsService'

const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

export const useNewsStore = defineStore('news', () => {
  const items   = ref([])
  const loading = ref(false)
  let timer     = null

  async function refresh() {
    loading.value = true
    try {
      const page = await fetchNews({ limit: 20 })
      items.value = page.items.map(mapNewsItem)
    } catch (e) {
      console.error('[news] fetch failed:', e)
    } finally {
      loading.value = false
    }
  }

  function start() {
    refresh()
    timer = setInterval(refresh, REFRESH_INTERVAL)
  }

  function stop() {
    if (timer) clearInterval(timer)
  }

  return { items, loading, refresh, start, stop }
})
