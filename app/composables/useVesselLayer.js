import VectorSource from "ol/source/Vector"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import { fromLonLat } from "ol/proj"
import WebGLVectorLayer from "ol/layer/WebGLVector"

const VESSEL_STYLE = {
  "shape-points": 3,
  "shape-radius": 8,
  "shape-rotation": ["get", "heading"],
  "shape-rotate-with-view": true,
  "shape-fill-color": [
    "case",
    ["<", ["get", "speed"], 5], "rgb(59, 130, 246)",
    ["<", ["get", "speed"], 15], "rgb(34, 197, 94)",
    ["<", ["get", "speed"], 25], "rgb(245, 158, 11)",
    "rgb(239, 68, 68)"
  ],
  "shape-stroke-color": "white",
  "shape-stroke-width": 1
}

export function useVesselLayer() {
  const source = new VectorSource()

  const layer = new WebGLVectorLayer({
    source,
    style: VESSEL_STYLE
  })

  function updateVessels(vessels) {
    const existingIds = new Set(source.getFeatures().map(f => f.getId()))
    const incomingIds = new Set(vessels.map(v => v.id))

    // remove features no longer in the list
    source.getFeatures().forEach((f) => {
      if (!incomingIds.has(f.getId())) source.removeFeature(f)
    })

    vessels.forEach((v) => {
      if (existingIds.has(v.id)) {
        // update existing feature in-place
        const f = source.getFeatureById(v.id)
        f.getGeometry().setCoordinates(fromLonLat([v.lon, v.lat]))
        f.set("heading", (v.heading * Math.PI) / 180)
        f.set("speed", v.speed)
      } else {
        // add new feature
        const f = new Feature({
          geometry: new Point(fromLonLat([v.lon, v.lat])),
          heading: (v.heading * Math.PI) / 180,
          speed: v.speed,
          id: v.id,
          name: v.name,
          type: v.type
        })
        f.setId(v.id)
        source.addFeature(f)
      }
    })
  }

  return { layer, source, updateVessels }
}
