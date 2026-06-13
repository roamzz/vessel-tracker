import { WMO_CODE, degreesToCompass, kmhToKnots, metresToNm } from '~/utils/weather'

export async function fetchNearestWeather({ lat, lon }) {
  return useApi()('/weather/nearest', { params: { lat, lon } })
}

export function mapWeather(raw) {
  const condition = WMO_CODE[raw.weather_code ?? 0] ?? { label: 'Unknown', icon: 'i-lucide-cloud' }
  return {
    temp:       Math.round(raw.temperature_2m       ?? 0),
    feelsLike:  Math.round(raw.apparent_temperature ?? 0),
    humidity:   Math.round(raw.relative_humidity_2m ?? 0),
    pressure:   Math.round(raw.pressure_msl         ?? 0),
    visibility: metresToNm(raw.visibility            ?? 0),
    wind: {
      speed: kmhToKnots(raw.wind_speed_10m     ?? 0),
      gusts: kmhToKnots(raw.wind_gusts_10m     ?? 0),
      dir:   degreesToCompass(raw.wind_direction_10m ?? 0),
    },
    condition:  condition.label,
    icon:       condition.icon,
    updatedAt:  raw.timestamp
      ? new Date(raw.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' UTC'
      : '—',
  }
}
