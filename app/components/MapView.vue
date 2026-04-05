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
const { layer: vesselLayer, updateVessels } = useVesselLayer()

watch(() => props.vessels, v => updateVessels(v), { deep: true })

onMounted(() => {
  const map = new Map({
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

  updateVessels(props.vessels)

  map.on("click", (event) => {
    const feature = map.forEachFeatureAtPixel(event.pixel, f => f)
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

  map.on("pointermove", (event) => {
    const hit = map.hasFeatureAtPixel(event.pixel)
    map.getTargetElement().style.cursor = hit ? "pointer" : ""
    const [lon, lat] = toLonLat(event.coordinate)
    const coords = `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? "N" : "S"}  ${Math.abs(lon).toFixed(4)}°${lon >= 0 ? "E" : "W"}`
    emit("update:coords", coords)
  })

  map.getView().on("change:resolution", () => {
    emit("update:zoom", map.getView().getZoom())
  })
})
</script>

<template>
  <div ref="mapContainer" class="w-full h-full" />
</template>
