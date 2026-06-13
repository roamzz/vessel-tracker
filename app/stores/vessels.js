import { defineStore } from 'pinia'
import { fetchLatestPositions, mapVessel } from '~/services/aisService'

const POLL_INTERVAL = 60 // seconds
const LIMIT = 50

export const useVesselStore = defineStore('vessels', () => {
  const vessels   = ref([])
  const isSyncing = ref(false)
  const countdown = ref(POLL_INTERVAL)

  let currentOffset = 0
  let timer = null

  // One request per poll. Advances offset each time so successive polls
  // fetch different vessel windows. Resets to 0 when the API returns empty.
  async function sync() {
    if (isSyncing.value) return
    isSyncing.value = true
    try {
      const data = await fetchLatestPositions({ limit: LIMIT, offset: currentOffset })
      if (data.length > 0) {
        vessels.value = data.map(mapVessel)
        currentOffset += LIMIT
      } else {
        currentOffset = 0
      }
    } catch (e) {
      console.error('[vessels] sync failed:', e)
    } finally {
      isSyncing.value = false
      countdown.value = POLL_INTERVAL
    }
  }

  function startPolling() {
    sync()
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) sync()
    }, 1000)
  }

  function stopPolling() {
    if (timer) clearInterval(timer)
  }

  return {
    vessels,
    isSyncing,
    countdown,
    pollInterval: POLL_INTERVAL,
    sync,
    startPolling,
    stopPolling,
  }
})
