// WMO weather code → { label, icon }
const WMO_CODE = {
  0:  { label: 'Clear',          icon: 'i-lucide-sun'            },
  1:  { label: 'Mainly Clear',   icon: 'i-lucide-sun'            },
  2:  { label: 'Partly Cloudy',  icon: 'i-lucide-cloud-sun'      },
  3:  { label: 'Overcast',       icon: 'i-lucide-cloud'          },
  45: { label: 'Foggy',          icon: 'i-lucide-cloud-fog'      },
  48: { label: 'Icy Fog',        icon: 'i-lucide-cloud-fog'      },
  51: { label: 'Light Drizzle',  icon: 'i-lucide-cloud-drizzle'  },
  53: { label: 'Drizzle',        icon: 'i-lucide-cloud-drizzle'  },
  55: { label: 'Heavy Drizzle',  icon: 'i-lucide-cloud-drizzle'  },
  61: { label: 'Light Rain',     icon: 'i-lucide-cloud-rain'     },
  63: { label: 'Rain',           icon: 'i-lucide-cloud-rain'     },
  65: { label: 'Heavy Rain',     icon: 'i-lucide-cloud-rain'     },
  71: { label: 'Light Snow',     icon: 'i-lucide-cloud-snow'     },
  73: { label: 'Snow',           icon: 'i-lucide-cloud-snow'     },
  75: { label: 'Heavy Snow',     icon: 'i-lucide-cloud-snow'     },
  80: { label: 'Rain Showers',   icon: 'i-lucide-cloud-rain'     },
  81: { label: 'Rain Showers',   icon: 'i-lucide-cloud-rain'     },
  82: { label: 'Heavy Showers',  icon: 'i-lucide-cloud-rain'     },
  95: { label: 'Thunderstorm',   icon: 'i-lucide-cloud-lightning' },
  96: { label: 'Thunderstorm',   icon: 'i-lucide-cloud-lightning' },
  99: { label: 'Thunderstorm',   icon: 'i-lucide-cloud-lightning' },
}

// Wind direction degrees → compass label
function degreesToCompass(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
  return dirs[Math.round(deg / 22.5) % 16]
}

// Wind speed: API returns km/h (Open-Meteo convention) → knots
function kmhToKnots(kmh) {
  return Math.round(kmh * 0.54)
}

// Visibility: API returns metres → nautical miles
function metresToNm(m) {
  return (m / 1852).toFixed(1)
}

export async function fetchNearestWeather({ lat, lon }) {
  const api = useApi()
  return api('/weather/nearest', { params: { lat, lon } })
}

export function mapWeather(raw) {
  const code = raw.weather_code ?? 0
  const condition = WMO_CODE[code] ?? { label: 'Unknown', icon: 'i-lucide-cloud' }

  return {
    temp:        Math.round(raw.temperature_2m    ?? 0),
    feelsLike:   Math.round(raw.apparent_temperature ?? 0),
    humidity:    Math.round(raw.relative_humidity_2m ?? 0),
    pressure:    Math.round(raw.pressure_msl       ?? 0),
    visibility:  metresToNm(raw.visibility          ?? 0),
    wind: {
      speed: kmhToKnots(raw.wind_speed_10m          ?? 0),
      gusts: kmhToKnots(raw.wind_gusts_10m          ?? 0),
      dir:   degreesToCompass(raw.wind_direction_10m ?? 0),
    },
    condition:   condition.label,
    icon:        condition.icon,
    updatedAt:   raw.timestamp
      ? new Date(raw.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' UTC'
      : '—',
  }
}
