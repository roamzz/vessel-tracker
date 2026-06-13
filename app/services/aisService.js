import { inferVesselType } from '~/utils/vessel'

export async function fetchLatestPositions({ limit = 50, offset = 0 } = {}) {
  return useApi()('/ais/positions/latest', { params: { limit, offset } })
}

export function mapVessel(pos) {
  return {
    id:      String(pos.mmsi),
    name:    pos.ship_name?.trim() || `MMSI ${pos.mmsi}`,
    type:    inferVesselType(pos.ship_type ?? pos.message_type),
    lat:     pos.latitude,
    lon:     pos.longitude,
    speed:   pos.sog          ?? pos.speed   ?? 0,
    heading: pos.true_heading ?? pos.cog     ?? 0,
  }
}
