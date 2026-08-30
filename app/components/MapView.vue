<script setup>
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import XYZ from "ol/source/XYZ"
import { fromLonLat, toLonLat } from "ol/proj"
import { boundingExtent } from "ol/extent"
import "ol/ol.css"
import { useVesselLayer } from "~/composables/useVesselLayer"

const colorMode = useColorMode()

// Esri basemaps — keyless. 256px tiles in {z}/{y}/{x} order. Esri has no dark
// street map, so dark mode falls back to the Dark Gray canvas; the canvas
// tiles top out around zoom 16, so we cap both for a consistent max zoom.
const ESRI = {
  dark: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
  light:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
}

function baseSource(mode) {
  return new XYZ({
    url: mode === "dark" ? ESRI.dark : ESRI.light,
    maxZoom: 16,
    crossOrigin: "anonymous",
    attributions:
      'Tiles © <a href="https://www.esri.com/" target="_blank">Esri</a> — Esri, HERE, Garmin, © OpenStreetMap contributors, and the GIS user community'
  })
}

let tileLayer = null

const props = defineProps({
  vessels: {
    type: Array,
    default: () => []
  },
  selectedId: {
    type: String,
    default: null
  }
})

const emit = defineEmits([
  "vessel-click",
  "update:zoom",
  "update:coords",
  "update:center",
  "update:bbox"
])

const mapContainer = ref(null)
const popupPixel = ref(null)
const { layer: vesselLayer, updateVessels } = useVesselLayer()

let mapInstance = null

function flyTo(lon, lat) {
  if (!mapInstance) return
  mapInstance.getView().animate({ center: fromLonLat([lon, lat]), duration: 600 })
}

function fitBounds(vessels) {
  if (!mapInstance || !vessels.length) return
  const coords = vessels.map((v) => fromLonLat([v.lon, v.lat]))
  const extent = boundingExtent(coords)
  mapInstance.getView().fit(extent, { padding: [80, 80, 80, 80], duration: 800, maxZoom: 12 })
}

// The replay endpoint needs a bbox to know which vessels to track, so the
// visible viewport itself becomes the query — panning/zooming refetches for
// the new area (see useVesselStore.setBBox).
function emitBBox() {
  if (!mapInstance) return
  const extent = mapInstance.getView().calculateExtent(mapInstance.getSize())
  const [minLon, minLat] = toLonLat([extent[0], extent[1]])
  const [maxLon, maxLat] = toLonLat([extent[2], extent[3]])
  emit("update:bbox", { minLat, maxLat, minLon, maxLon })
}

// "change:center" doesn't fire for the center set in the View constructor,
// only on later pans — so without this, weather never loads until the user
// moves the map (see useWeatherStore.fetch, called from update:center).
function emitCenter() {
  if (!mapInstance) return
  const [lon, lat] = toLonLat(mapInstance.getView().getCenter())
  emit("update:center", { lat, lon })
}

function fitIfEmpty(vessels) {
  if (!mapInstance || !vessels.length) return
  const viewport = mapInstance.getView().calculateExtent(mapInstance.getSize())
  const anyVisible = vessels.some((v) => {
    const coord = fromLonLat([v.lon, v.lat])
    return (
      coord[0] >= viewport[0] &&
      coord[0] <= viewport[2] &&
      coord[1] >= viewport[1] &&
      coord[1] <= viewport[3]
    )
  })
  if (!anyVisible) fitBounds(vessels)
}

defineExpose({ flyTo, fitBounds, fitIfEmpty })

watch(
  () => colorMode.value,
  (mode) => {
    tileLayer?.setSource(baseSource(mode))
  }
)

watchEffect(() => {
  updateVessels(props.vessels, props.selectedId)
  if (mapInstance && props.selectedId) {
    const vessel = props.vessels.find((v) => v.id === props.selectedId)
    if (vessel) {
      popupPixel.value = mapInstance.getPixelFromCoordinate(fromLonLat([vessel.lon, vessel.lat]))
    }
  } else {
    popupPixel.value = null
  }
})

onMounted(() => {
  tileLayer = new TileLayer({ source: baseSource(colorMode.value) })

  mapInstance = new Map({
    target: mapContainer.value,
    layers: [tileLayer, vesselLayer],
    view: new View({
      center: fromLonLat([0, 51]),
      zoom: 5,
      // Esri's gray canvas tiles stop at z16 — cap the view so we never
      // pan into blank space past the last available tile level.
      maxZoom: 16
    })
  })

  mapInstance.on("postrender", () => {
    if (props.selectedId) {
      const vessel = props.vessels.find((v) => v.id === props.selectedId)
      if (vessel) {
        popupPixel.value = mapInstance.getPixelFromCoordinate(fromLonLat([vessel.lon, vessel.lat]))
      }
    }
  })

  mapInstance.on("click", (event) => {
    const feature = mapInstance.forEachFeatureAtPixel(event.pixel, (f) => f)
    if (feature) {
      emit("vessel-click", {
        id: feature.get("id"),
        name: feature.get("name"),
        // speed/heading/type hidden — the feature no longer carries these
        // (API doesn't return sog/true_heading/cog/ship_type yet)
        // speed: feature.get("speed"),
        // heading: Math.round((feature.get("heading") * 180) / Math.PI),
        // type: feature.get("type")
      })
    } else {
      emit("vessel-click", null)
    }
  })

  mapInstance.on("pointermove", (event) => {
    const hit = mapInstance.hasFeatureAtPixel(event.pixel)
    mapInstance.getTargetElement().style.cursor = hit ? "pointer" : ""
    const [lon, lat] = toLonLat(event.coordinate)
    const coords = `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? "N" : "S"}  ${Math.abs(lon).toFixed(4)}°${lon >= 0 ? "E" : "W"}`
    emit("update:coords", coords)
  })

  mapInstance.getView().on("change:resolution", () => {
    emit("update:zoom", mapInstance.getView().getZoom())
  })

  mapInstance.getView().on("change:center", () => {
    const [lon, lat] = toLonLat(mapInstance.getView().getCenter())
    emit("update:center", { lat, lon })
  })

  // "moveend" covers pan/zoom after the fact; "rendercomplete" fires once so
  // we get an initial bbox as soon as the map has a real size, without
  // waiting for the user to move it first.
  mapInstance.on("moveend", emitBBox)
  mapInstance.once("rendercomplete", emitBBox)
  mapInstance.once("rendercomplete", emitCenter)
})
</script>

<template>
  <div class="relative w-full h-full">
    <div ref="mapContainer" class="w-full h-full" />

    <!-- Popup anchor — positioned over the selected vessel marker -->
    <div
      v-if="popupPixel"
      class="absolute z-20 pointer-events-none"
      :style="{ left: `${popupPixel[0]}px`, top: `${popupPixel[1]}px` }"
    >
      <slot name="popup" />
    </div>
  </div>
</template>
