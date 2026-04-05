<script setup>
// index.vue
// Main page — composes all components and wires up shared state.
//
// State flow:
//   useVessels()  →  vessels, countdown, pollInterval, isSyncing, syncNow
//   vessels       →  VesselSidebar (list) + MapView (markers)
//   selectedId    →  MapView (highlight + popup position) + VesselSidebar (active row)
//   selectedId    →  selectedVessel (computed) → VesselPopup
//
// Interactions:
//   Click marker on map   → onVesselClick  → set selectedId
//   Click row in sidebar  → onSidebarSelect → set selectedId + flyTo on map
//   Click X on popup      → selectedId = null
import { useVessels } from "~/composables/useVessels"

const { vessels, countdown, pollInterval, isSyncing, syncNow } = useVessels(200)

const selectedId = ref(null)
const zoom = ref(7)
const coords = ref("Move cursor over map")

const mapRef = ref(null)
const selectedVessel = computed(() => vessels.value.find(v => v.id === selectedId.value) || null)

function onVesselClick(vessel) {
  selectedId.value = vessel ? vessel.id : null
}

function onSidebarSelect(id) {
  selectedId.value = selectedId.value === id ? null : id
  if (selectedId.value) {
    const vessel = vessels.value.find(v => v.id === selectedId.value)
    if (vessel) mapRef.value?.flyTo(vessel.lon, vessel.lat)
  }
}
</script>

<template>
  <div class="flex flex-col h-screen">
    <AppNav :vessel-count="vessels.length" :countdown="countdown" :is-syncing="isSyncing" @sync="syncNow" />

    <div class="flex flex-1 overflow-hidden">
      <VesselSidebar :vessels="vessels" :selected-id="selectedId" @select="onSidebarSelect" />

      <div class="relative flex-1">
        <MapView
          ref="mapRef"
          :vessels="vessels"
          :selected-id="selectedId"
          @vessel-click="onVesselClick"
          @update:zoom="z => zoom = z"
          @update:coords="c => coords = c"
        >
          <template #popup>
            <VesselPopup :vessel="selectedVessel" @close="selectedId = null" />
          </template>
        </MapView>
      </div>
    </div>

    <AppStatusBar :zoom="zoom" :coords="coords" :countdown="countdown" :poll-interval="pollInterval" />
  </div>
</template>
