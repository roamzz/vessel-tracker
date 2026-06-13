export const WMO_CODE = {
  0:  { label: 'Clear',          icon: 'i-lucide-sun'             },
  1:  { label: 'Mainly Clear',   icon: 'i-lucide-sun'             },
  2:  { label: 'Partly Cloudy',  icon: 'i-lucide-cloud-sun'       },
  3:  { label: 'Overcast',       icon: 'i-lucide-cloud'           },
  45: { label: 'Foggy',          icon: 'i-lucide-cloud-fog'       },
  48: { label: 'Icy Fog',        icon: 'i-lucide-cloud-fog'       },
  51: { label: 'Light Drizzle',  icon: 'i-lucide-cloud-drizzle'   },
  53: { label: 'Drizzle',        icon: 'i-lucide-cloud-drizzle'   },
  55: { label: 'Heavy Drizzle',  icon: 'i-lucide-cloud-drizzle'   },
  61: { label: 'Light Rain',     icon: 'i-lucide-cloud-rain'      },
  63: { label: 'Rain',           icon: 'i-lucide-cloud-rain'      },
  65: { label: 'Heavy Rain',     icon: 'i-lucide-cloud-rain'      },
  71: { label: 'Light Snow',     icon: 'i-lucide-cloud-snow'      },
  73: { label: 'Snow',           icon: 'i-lucide-cloud-snow'      },
  75: { label: 'Heavy Snow',     icon: 'i-lucide-cloud-snow'      },
  80: { label: 'Rain Showers',   icon: 'i-lucide-cloud-rain'      },
  81: { label: 'Rain Showers',   icon: 'i-lucide-cloud-rain'      },
  82: { label: 'Heavy Showers',  icon: 'i-lucide-cloud-rain'      },
  95: { label: 'Thunderstorm',   icon: 'i-lucide-cloud-lightning' },
  96: { label: 'Thunderstorm',   icon: 'i-lucide-cloud-lightning' },
  99: { label: 'Thunderstorm',   icon: 'i-lucide-cloud-lightning' },
}

const COMPASS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']

export function degreesToCompass(deg) {
  return COMPASS[Math.round(deg / 22.5) % 16]
}

export function kmhToKnots(kmh) {
  return Math.round(kmh * 0.54)
}

export function metresToNm(m) {
  return (m / 1852).toFixed(1)
}
