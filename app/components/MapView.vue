<script setup>
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"
import { fromLonLat } from "ol/proj"
import "ol/ol.css"
import { useVesselLayer } from "~/composables/useVesselLayer"
import { mockVessels } from "~/data/mockVessels"

const emit = defineEmits(["vessel-click"])

const mapContainer = ref(null)
const { layer: vesselLayer, updateVessels } = useVesselLayer()

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

  updateVessels(mockVessels)

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
    }
  })

  map.on("pointermove", (event) => {
    const hit = map.hasFeatureAtPixel(event.pixel)
    map.getTargetElement().style.cursor = hit ? "pointer" : ""
  })
})
</script>

<template>
  <div
    ref="mapContainer"
    class="w-full h-full"
  />
</template>
