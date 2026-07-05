import { defineStore } from 'pinia'
import { fetchMessages, mapTick } from '~/services/lmaxService'

const LIMIT = 50

export const useTickerStore = defineStore('ticker', () => {
  const ticks     = ref([])
  const isLoading = ref(false)

  let offset = 0
  const lastPrices = {} // instrument_id -> last seen price, persisted across batches — drives the up/down color per tick

  // API returns newest-first; walk oldest→newest so each tick's direction
  // compares against the price that actually preceded it in time.
  function withDirections(items) {
    const directions = new Map()
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i]
      const price = Number(item.payload?.last_price)
      const prev = lastPrices[item.instrument_id]
      if (Number.isFinite(price) && prev !== undefined) {
        directions.set(item.id, price > prev ? 'up' : price < prev ? 'down' : 'flat')
      } else {
        directions.set(item.id, 'flat')
      }
      if (Number.isFinite(price)) lastPrices[item.instrument_id] = price
    }
    return items.map(item => mapTick(item, directions.get(item.id)))
  }

  // offset is a plain page cursor here (unlike the AIS replay clock) — each
  // batch of LIMIT ticks scrolls once, then we advance to the next page.
  async function loadNextBatch() {
    if (isLoading.value) return
    isLoading.value = true
    try {
      const page = await fetchMessages({ limit: LIMIT, offset })
      if (page.items.length === 0) {
        offset = 0 // ran past the end — wrap around so the tape keeps running
        return loadNextBatch()
      }
      ticks.value = withDirections(page.items)
      offset += LIMIT
    } catch (e) {
      console.error('[ticker] fetch failed:', e)
    } finally {
      isLoading.value = false
    }
  }

  function start() {
    if (ticks.value.length === 0) loadNextBatch()
  }

  // Called by the ticker UI once it's scrolled through the current batch
  function onBatchExhausted() {
    loadNextBatch()
  }

  return { ticks, isLoading, start, onBatchExhausted }
})
