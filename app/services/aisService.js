function getBaseUrl() {
  return useRuntimeConfig().public.aisBaseUrl
}

export async function fetchLatestPositions({ limit = 50, offset = 0 } = {}) {
  const params = new URLSearchParams({ limit, offset })
  const res = await fetch(`${getBaseUrl()}/positions/latest?${params}`)
  if (!res.ok) throw new Error(`AIS API error: ${res.status}`)
  return res.json()
}

// Maps a raw API VesselPosition to the internal vessel shape used by the map and sidebar.
// Falls back gracefully for fields the API may or may not return.
export function mapVessel(pos) {
  return {
    id:      String(pos.mmsi),
    name:    pos.ship_name?.trim() || `MMSI ${pos.mmsi}`,
    type:    inferType(pos.ship_type ?? pos.message_type),
    lat:     pos.latitude,
    lon:     pos.longitude,
    speed:   pos.sog         ?? pos.speed   ?? 0,
    heading: pos.true_heading ?? pos.cog    ?? pos.heading ?? 0,
  }
}

// AIS ship type codes → internal type label.
// 60-69 = passenger, 80-89 = tanker, everything else = cargo.
function inferType(code) {
  if (code >= 60 && code <= 69) return 'passenger'
  if (code >= 80 && code <= 89) return 'tanker'
  return 'cargo'
}
