export async function fetchLatestPositions({ limit = 50, offset = 0 } = {}) {
  const api = useApi()
  return api('/ais/positions/latest', { params: { limit, offset } })
}

export function mapVessel(pos) {
  return {
    id:      String(pos.mmsi),
    name:    pos.ship_name?.trim() || `MMSI ${pos.mmsi}`,
    type:    inferType(pos.ship_type ?? pos.message_type),
    lat:     pos.latitude,
    lon:     pos.longitude,
    speed:   pos.sog          ?? pos.speed   ?? 0,
    heading: pos.true_heading ?? pos.cog     ?? 0,
  }
}

function inferType(code) {
  if (code >= 60 && code <= 69) return 'passenger'
  if (code >= 80 && code <= 89) return 'tanker'
  return 'cargo'
}
