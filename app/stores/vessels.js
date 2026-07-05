import { defineStore } from 'pinia'
import { fetchReplayPositions, mapVessel } from '~/services/aisService'

const POLL_INTERVAL = 60 // seconds
const SHIPS = 2000 // API max — show every vessel in the bbox, not a page of them

function bboxEqual(a, b) {
  if (!a || !b) return a === b
  return a.minLat === b.minLat && a.maxLat === b.maxLat && a.minLon === b.minLon && a.maxLon === b.maxLon
}

export const useVesselStore = defineStore('vessels', () => {
  const vessels   = ref([])
  const isSyncing = ref(false)
  const countdown = ref(POLL_INTERVAL)

  // Sent on every request so the server keeps this client's T0 stable across
  // polls, instead of us having to store and echo back the anchor timestamp.
  const sessionId = crypto.randomUUID()
  let bbox = null
  let offset = 0
  let timer = null

  // offset is minutes since the server's T0 for this bbox/session — each poll
  // advances the replay clock by one minute rather than paging through vessels.
  // Changing bbox picks a new T0 on the server, so we rewind offset to 0.
  async function sync() {
    if (isSyncing.value || !bbox) return
    isSyncing.value = true
    try {
      const data = await fetchReplayPositions({ bbox, offset, ships: SHIPS, sessionId })
      vessels.value = data.items.map(mapVessel)
      offset += 1
    } catch (e) {
      console.error('[vessels] sync failed:', e)
    } finally {
      isSyncing.value = false
      countdown.value = POLL_INTERVAL
    }
  }

  // Called whenever the map viewport changes (see MapView's "update:bbox").
  // A new bbox means the server may pick a different T0, so replaying from
  // the old offset would be meaningless — reset and fetch fresh immediately.
  function setBBox(next) {
    if (bboxEqual(bbox, next)) return
    bbox = next
    offset = 0
    sync()
  }

  function startPolling() {
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
    setBBox,
    startPolling,
    stopPolling,
  }
})
