import { defineStore } from 'pinia'
import { fetchNearestWeather, mapWeather } from '~/services/weatherService'

// Only re-fetch if the map center moved more than ~10 km
const MIN_DELTA = 0.1 // degrees

export const useWeatherStore = defineStore('weather', () => {
  const weather  = ref(null)
  const loading  = ref(false)
  const lastLat  = ref(null)
  const lastLon  = ref(null)

  async function fetch({ lat, lon }) {
    if (
      lastLat.value !== null &&
      Math.abs(lat - lastLat.value) < MIN_DELTA &&
      Math.abs(lon - lastLon.value) < MIN_DELTA
    ) return

    loading.value = true
    try {
      const raw = await fetchNearestWeather({ lat, lon })
      weather.value = mapWeather(raw)
      lastLat.value = lat
      lastLon.value = lon
    } catch (e) {
      console.error('[weather] fetch failed:', e)
    } finally {
      loading.value = false
    }
  }

  return { weather, loading, fetch }
})
