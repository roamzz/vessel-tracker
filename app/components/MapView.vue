<script setup>
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"
import { fromLonLat } from "ol/proj"
import "ol/ol.css"
import { useVesselLayer } from "~/composables/useVesselLayer"
import { mockVessels } from "~/data/mockVessels"

const mapContainer = ref(null)
const { layer: vesselLayer, updateVessels } = useVesselLayer()

onMounted(() => {
  new Map({
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
})
</script>

<template>
  <div
    ref="mapContainer"
    class="w-full h-full"
  />
</template>
