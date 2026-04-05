// useVesselLayer.js
// OpenLayers layer composable — manages the WebGL vector layer that renders vessel markers.
//
// Markers are triangles colored by vessel type:
//   blue   = cargo
//   orange = tanker
//   green  = passenger
//
// The selected vessel is rendered larger with a white stroke.
// Rotation is based on heading (converted from degrees to radians).
//
// Exposes:
//   layer           — the OpenLayers WebGLVectorLayer to add to the map
//   source          — the underlying VectorSource (useful for hit detection)
//   updateVessels() — call this with the latest vessel array + selectedId to sync the layer

import VectorSource from "ol/source/Vector"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import { fromLonLat } from "ol/proj"
import WebGLVectorLayer from "ol/layer/WebGLVector"

// WebGL style using OpenLayers expression syntax.
// typeCode is a numeric encoding of vessel type (see TYPE_CODE below).
// selected is 1 for the active vessel, 0 for all others.
const BASE_STYLE = {
  "shape-points": 3,
  "shape-radius": [
    "case",
    ["==", ["get", "selected"], 1], 14,
    8
  ],
  "shape-rotation": ["get", "heading"],
  "shape-rotate-with-view": true,
  "shape-fill-color": [
    "case",
    ["==", ["get", "typeCode"], 1], "rgb(59, 130, 246)", // cargo → blue
    ["==", ["get", "typeCode"], 2], "rgb(245, 158, 11)", // tanker → orange
    "rgb(34, 197, 94)" // passenger → green
  ],
  "shape-stroke-color": [
    "case",
    ["==", ["get", "selected"], 1], "white",
    "rgba(255,255,255,0.4)"
  ],
  "shape-stroke-width": [
    "case",
    ["==", ["get", "selected"], 1], 2,
    1
  ]
}

export function useVesselLayer() {
  const source = new VectorSource()

  const layer = new WebGLVectorLayer({
    source,
    style: BASE_STYLE
  })

  // Maps vessel type string to a numeric code for use in WebGL expressions
  const TYPE_CODE = { cargo: 1, tanker: 2, passenger: 3 }

  // Performs a diff update — updates existing features in-place and adds/removes as needed.
  // This avoids clearing the entire source on each poll, which is important for WebGL performance.
  function updateVessels(vessels, selectedId = null) {
    const existingIds = new Set(source.getFeatures().map(f => f.getId()))
    const incomingIds = new Set(vessels.map(v => v.id))

    // Remove features that are no longer in the vessel list
    source.getFeatures().forEach((f) => {
      if (!incomingIds.has(f.getId())) source.removeFeature(f)
    })

    vessels.forEach((v) => {
      const isSelected = v.id === selectedId ? 1 : 0
      const typeCode = TYPE_CODE[v.type] || 1
      if (existingIds.has(v.id)) {
        // Update position and properties in-place (no re-render of unchanged features)
        const f = source.getFeatureById(v.id)
        f.getGeometry().setCoordinates(fromLonLat([v.lon, v.lat]))
        f.set("heading", (v.heading * Math.PI) / 180)
        f.set("speed", v.speed)
        f.set("selected", isSelected)
        f.set("typeCode", typeCode)
      } else {
        // New vessel — create and add feature
        const f = new Feature({
          geometry: new Point(fromLonLat([v.lon, v.lat])),
          heading: (v.heading * Math.PI) / 180,
          speed: v.speed,
          selected: isSelected,
          typeCode,
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
