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
    source.clear()
    const features = vessels.map((v) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([v.lon, v.lat])),
        heading: (v.heading * Math.PI) / 180,
        speed: v.speed,
        id: v.id,
        name: v.name,
        type: v.type
      })
      feature.setId(v.id)
      return feature
    })
    source.addFeatures(features)
  }

  return { layer, source, updateVessels }
}
