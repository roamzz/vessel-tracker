# AIS API — Frontend Requirements for Backend Team

## Context

The vessel tracker frontend loads vessel positions and renders them on a map.
Current implementation uses `GET /positions/latest?limit=50&offset=N` which has
several limitations described below.

---

## 1. Bbox-first loading (priority)

**Problem:** Paginating the global vessel list with `offset` is not viable for a
map application. Offset is positional — offset=50 returns vessels 51–100 by sort
order, not updated positions of vessels 1–50. As new AIS messages arrive the sort
order shifts, making pagination inconsistent between requests.

**Request:** Make bbox parameters (`min_lat`, `max_lat`, `min_lon`, `max_lon`)
the primary way to query positions. The frontend will send the current map
viewport on every pan/zoom and fetch only vessels in that area.

```
GET /positions/latest?min_lat=49.5&max_lat=61.0&min_lon=-8.5&max_lon=2.5&limit=500
```

With bbox, a high `limit` (500–1000) covers any realistic viewport without
pagination. `offset` becomes irrelevant for the map view.

**Why this matters:** Without bbox, loading 50 vessels from a global list and
replacing them every 60s gives a poor and inconsistent UX — different vessels
appear each poll with no geographic logic.

---

## 2. Position refresh for a known MMSI set

**Problem:** Once the frontend has loaded vessels for a viewport, subsequent
polls should refresh positions for **the same vessels**, not re-query by offset.

**Request:** Support filtering by a list of MMSIs so the frontend can say
"give me the latest positions for these specific vessels":

```
GET /positions/latest?mmsi=123456789,234567890,345678901
```

or as a POST body if the list is large:

```
POST /positions/latest/batch
{ "mmsi": [123456789, 234567890, 345678901] }
```

**Suggested flow:**

1. Initial load → bbox query to get vessels in viewport
2. Subsequent polls → mmsi-list query to refresh positions of already-loaded vessels
3. On map pan/zoom → new bbox query for the new viewport area

---

## 3. Missing fields in `/positions/latest` response

The current response is missing fields required for correct map rendering.
Please include in each `VesselPosition` object:

| Field          | Description                               | AIS source                               |
| -------------- | ----------------------------------------- | ---------------------------------------- |
| `sog`          | Speed over ground (knots)                 | Msg type 1/2/3/18                        |
| `cog`          | Course over ground (degrees)              | Msg type 1/2/3/18                        |
| `true_heading` | True heading (degrees, 0–359)             | Msg type 1/2/3/18                        |
| `ship_type`    | Numeric ship type code (see ITU-R M.1371) | Msg type 5/24                            |
| `ship_name`    | Vessel name                               | Msg type 5/24 — already present, keep it |

`true_heading` drives the triangle marker rotation on the map.
`ship_type` enables cargo/tanker/passenger filtering in the sidebar.

**AIS ship type code ranges for reference:**

- 60–69 → Passenger
- 70–79 → Cargo
- 80–89 → Tanker

---

## 4. Total count in response

**Request:** Return the total number of vessels matching the query (before limit)
so the frontend can show "Showing 50 of 312 vessels" and decide whether to
paginate or widen the bbox.

Preferred: response header `X-Total-Count: 312`
Alternative: wrap response body `{ "total": 312, "data": [...] }`

---

## 6. Weather endpoint — bbox support

**Problem:** The current `/weather/nearest?lat=&lon=` endpoint accepts a single
point and returns the nearest weather station to it. The frontend calls this
after every map pan (debounced), passing the map center. This works but it is
a single point of truth for the entire viewport — a large viewport could be
covering very different sea conditions.

**Request:** Add an optional bbox variant so the frontend can request weather
observations for the entire visible area and display multiple data points:

```
GET /weather/observations?min_lat=49.5&max_lat=61.0&min_lon=-8.5&max_lon=2.5
```

Response should be an array of observation objects (same schema as `/nearest`
but without the coordinate-matching step):

```json
[
  { "lat": 51.5, "lon": -1.2, "temperature_2m": 14.2, "wind_speed_10m": 22.0, ... },
  { "lat": 53.0, "lon": -3.0, "temperature_2m": 12.8, "wind_speed_10m": 18.5, ... }
]
```

**Why this matters:** A bbox call replaces the per-pan request with one call
that is tied to the map viewport (same as vessel loading), reduces API chatter,
and allows showing multiple weather stations on the map as overlays.

**Current workaround:** Single `/nearest` call with map center + 600ms debounce.

---

## 5. CORS

**Request:** Confirm CORS headers are set to allow browser requests from the
frontend origin (both local dev and the production Netlify domain).

```
Access-Control-Allow-Origin: https://vessel-tracker.netlify.app
Access-Control-Allow-Origin: http://localhost:3001
```

---

## Summary of requested changes

| #   | Change                                                    | Priority |
| --- | --------------------------------------------------------- | -------- |
| 1   | Bbox params as primary query method                       | High     |
| 2   | MMSI-list endpoint for position refresh                   | High     |
| 3   | Add `sog`, `cog`, `true_heading`, `ship_type` to response | High     |
| 4   | Total count in response                                   | Medium   |
| 5   | CORS headers confirmed                                    | Medium   |
| 6   | Weather bbox endpoint (`/weather/observations?bbox`)      | Medium   |
