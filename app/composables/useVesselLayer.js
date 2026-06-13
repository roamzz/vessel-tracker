import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import Style from "ol/style/Style"
import Icon from "ol/style/Icon"
import { fromLonLat } from "ol/proj"
import { VESSEL_COLORS } from "~/utils/vessel"

// Canvas cache — 3 types × 2 selection states = 6 variants
const canvasCache = {}

function drawVessel(type, selected) {
  const key = `${type}-${selected ? 1 : 0}`
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

  ctx.fillStyle = VESSEL_COLORS[type] || VESSEL_COLORS.cargo
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
  const type = feature.get('type') || 'cargo'
  const heading = feature.get('heading') || 0
  const canvas = drawVessel(type, selected)

  return new Style({
    image: new Icon({
      img: canvas,
      imgSize: [canvas.width, canvas.height],
      rotation: heading,
      rotateWithView: false,
      scale: scaleFromResolution(resolution),
    })
  })
}

export function useVesselLayer() {
  const source = new VectorSource()
  const layer = new VectorLayer({ source, style: vesselStyle })
  const TYPE_CODE = { cargo: 1, tanker: 2, passenger: 3 }

  function updateVessels(vessels, selectedId = null) {
    const existingIds = new Set(source.getFeatures().map(f => f.getId()))
    const incomingIds = new Set(vessels.map(v => v.id))

    source.getFeatures().forEach(f => {
      if (!incomingIds.has(f.getId())) source.removeFeature(f)
    })

    vessels.forEach(v => {
      const isSelected = v.id === selectedId ? 1 : 0
      if (existingIds.has(v.id)) {
        const f = source.getFeatureById(v.id)
        f.getGeometry().setCoordinates(fromLonLat([v.lon, v.lat]))
        f.set('heading', (v.heading * Math.PI) / 180)
        f.set('speed', v.speed)
        f.set('selected', isSelected)
        f.set('type', v.type)
      } else {
        const f = new Feature({
          geometry: new Point(fromLonLat([v.lon, v.lat])),
          heading: (v.heading * Math.PI) / 180,
          speed: v.speed,
          selected: isSelected,
          type: v.type,
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
