// import { inferVesselType } from '~/utils/vessel' -- unused while type is commented out below

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

// type/speed/heading are commented out — neither /positions/latest nor
// /positions/replay returns ship_type, sog, true_heading, or cog, so these were
// always defaulting to fake values (cargo, 0, 0). Restore once the API adds them.
export function mapVessel(pos) {
  return {
    id:   String(pos.mmsi),
    name: pos.ship_name?.trim() || `MMSI ${pos.mmsi}`,
    lat:  pos.latitude,
    lon:  pos.longitude,
    // type:    inferVesselType(pos.ship_type ?? pos.message_type),
    // speed:   pos.sog          ?? pos.speed   ?? 0,
    // heading: pos.true_heading ?? pos.cog     ?? 0,
  }
}
