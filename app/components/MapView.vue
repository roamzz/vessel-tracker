<script setup>
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"
import { fromLonLat, toLonLat } from "ol/proj"
import "ol/ol.css"
import { useVesselLayer } from "~/composables/useVesselLayer"

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

const emit = defineEmits(["vessel-click", "update:zoom", "update:coords"])

const mapContainer = ref(null)
const popupPixel = ref(null)
const { layer: vesselLayer, updateVessels } = useVesselLayer()

let mapInstance = null

watchEffect(() => {
  updateVessels(props.vessels, props.selectedId)
  if (mapInstance && props.selectedId) {
    const vessel = props.vessels.find(v => v.id === props.selectedId)
    if (vessel) {
      popupPixel.value = mapInstance.getPixelFromCoordinate(fromLonLat([vessel.lon, vessel.lat]))
    }
  } else {
    popupPixel.value = null
  }
})

onMounted(() => {
  mapInstance = new Map({
    target: mapContainer.value,
    layers: [
      new TileLayer({ source: new OSM() }),
      vesselLayer
    ],
    view: new View({
      center: fromLonLat([23.64, 37.94]),
      zoom: 7
    })
  })

  mapInstance.on("postrender", () => {
    if (props.selectedId) {
      const vessel = props.vessels.find(v => v.id === props.selectedId)
      if (vessel) {
        popupPixel.value = mapInstance.getPixelFromCoordinate(fromLonLat([vessel.lon, vessel.lat]))
      }
    }
  })

  mapInstance.on("click", (event) => {
    const feature = mapInstance.forEachFeatureAtPixel(event.pixel, f => f)
    if (feature) {
      emit("vessel-click", {
        id: feature.get("id"),
        name: feature.get("name"),
        speed: feature.get("speed"),
        heading: Math.round((feature.get("heading") * 180) / Math.PI),
        type: feature.get("type")
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
})
</script>

<template>
  <div class="relative w-full h-full">
    <div ref="mapContainer" class="w-full h-full" />

    <div
      v-if="popupPixel"
      class="absolute z-20 pointer-events-none"
      :style="{ left: `${popupPixel[0]}px`, top: `${popupPixel[1]}px` }"
    >
      <slot name="popup" />
    </div>
  </div>
</template>
