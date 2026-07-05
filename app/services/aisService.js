import { inferVesselType } from '~/utils/vessel'

// Replay endpoint, not the plain "latest positions" one: offset here is minutes
// since the server-side T0 for this bbox/session, not a page cursor. ships=2000
// is the API's max — we want every vessel in the bbox, not a limited page of them.
export async function fetchReplayPositions({ bbox, offset = 0, ships = 2000, sessionId } = {}) {
  return useApi()('/ais/positions/replay', {
    params: {
      min_lat: bbox.minLat,
      max_lat: bbox.maxLat,
      min_lon: bbox.minLon,
      max_lon: bbox.maxLon,
      offset,
      ships,
      session_id: sessionId,
    }
  })
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
