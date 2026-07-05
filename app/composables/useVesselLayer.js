import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import Style from "ol/style/Style"
import Icon from "ol/style/Icon"
import { fromLonLat } from "ol/proj"
// import { VESSEL_COLORS } from "~/utils/vessel" -- unused while per-type coloring is commented out below

// Canvas cache — one shape per selection state. Per-type variants are commented
// out below until the API returns ship_type.
const canvasCache = {}

const VESSEL_COLOR = '#60a5fa' // neutral color — real per-type colors need ship_type from the API

function drawVessel(selected) {
  const key = selected ? 1 : 0
  if (canvasCache[key]) return canvasCache[key]

  const size = selected ? 30 : 20
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const cx = size / 2
  const cy = size / 2
  const w = size * 0.30  // half-beam
  const h = size * 0.44  // half-length

  ctx.save()
  ctx.translate(cx, cy)

  // Vessel silhouette: pointed bow (top), tapered stern (bottom)
  ctx.beginPath()
  ctx.moveTo(0, -h)           // bow
  ctx.lineTo(w, -h * 0.05)    // starboard beam
  ctx.lineTo(w * 0.45, h)     // starboard stern
  ctx.lineTo(-w * 0.45, h)    // port stern
  ctx.lineTo(-w, -h * 0.05)   // port beam
  ctx.closePath()

  ctx.fillStyle = VESSEL_COLOR
  ctx.fill()

  if (selected) {
    ctx.shadowColor = 'rgba(255,255,255,0.9)'
    ctx.shadowBlur = 7
  }

  ctx.strokeStyle = selected ? '#ffffff' : 'rgba(255,255,255,0.55)'
  ctx.lineWidth = selected ? 2 : 1.2
  ctx.stroke()
  ctx.restore()

  canvasCache[key] = canvas
  return canvas
}

// resolution is meters/px in EPSG:3857 — higher = zoomed out
function scaleFromResolution(resolution) {
  if (resolution > 5000) return 0.40
  if (resolution > 1500) return 0.60
  if (resolution > 500)  return 0.80
  return 1.0
}

function vesselStyle(feature, resolution) {
  const selected = feature.get('selected') === 1
  const canvas = drawVessel(selected)

  return new Style({
    image: new Icon({
      img: canvas,
      imgSize: [canvas.width, canvas.height],
      // rotation left at 0 — the API doesn't return true_heading/cog yet
      rotateWithView: false,
      scale: scaleFromResolution(resolution),
    })
  })
}

// Each sync replaces a vessel's coordinates outright (it's a new replay
// offset, not an interpolated track), so without this the marker would just
// teleport. Gliding between old and new position makes that jump readable
// as "this vessel moved" rather than a silent snap.
const GLIDE_DURATION = 1000 // ms — long enough that a per-minute position change reads as movement

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

export function useVesselLayer() {
  const source = new VectorSource()
  const layer = new VectorLayer({ source, style: vesselStyle })

  // id -> { from: [x, y], to: [x, y], start: DOMHighResTimeStamp }
  const glides = new Map()
  let rafId = null

  function stepGlides(now) {
    let animating = false
    glides.forEach((glide, id) => {
      const f = source.getFeatureById(id)
      if (!f) {
        glides.delete(id)
        return
      }
      const t = Math.min((now - glide.start) / GLIDE_DURATION, 1)
      const e = easeOutCubic(t)
      f.getGeometry().setCoordinates([
        glide.from[0] + (glide.to[0] - glide.from[0]) * e,
        glide.from[1] + (glide.to[1] - glide.from[1]) * e,
      ])
      if (t < 1) animating = true
      else glides.delete(id)
    })
    rafId = animating ? requestAnimationFrame(stepGlides) : null
  }

  function glideTo(id, toCoord) {
    const f = source.getFeatureById(id)
    glides.set(id, { from: f.getGeometry().getCoordinates(), to: toCoord, start: performance.now() })
    if (!rafId) rafId = requestAnimationFrame(stepGlides)
  }

  function updateVessels(vessels, selectedId = null) {
    const existingIds = new Set(source.getFeatures().map(f => f.getId()))
    const incomingIds = new Set(vessels.map(v => v.id))

    source.getFeatures().forEach(f => {
      if (!incomingIds.has(f.getId())) {
        glides.delete(f.getId())
        source.removeFeature(f)
      }
    })

    vessels.forEach(v => {
      const isSelected = v.id === selectedId ? 1 : 0
      const coord = fromLonLat([v.lon, v.lat])
      if (existingIds.has(v.id)) {
        const f = source.getFeatureById(v.id)
        f.set('selected', isSelected)
        glideTo(v.id, coord) // known vessel, new offset — animate to the updated fix
      } else {
        const f = new Feature({
          geometry: new Point(coord),
          selected: isSelected,
          id: v.id,
          name: v.name,
        })
        f.setId(v.id)
        source.addFeature(f)
      }
    })
  }

  return { layer, source, updateVessels }
}
