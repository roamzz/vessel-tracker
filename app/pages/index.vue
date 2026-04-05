<script setup>
import { useVessels } from "~/composables/useVessels"

const { vessels, countdown, isSyncing, syncNow } = useVessels(20)

const selectedId = ref(null)
const zoom = ref(7)
const coords = ref("Move cursor over map")

function onVesselClick(vessel) {
  selectedId.value = vessel ? vessel.id : null
}

function onSidebarSelect(id) {
  selectedId.value = selectedId.value === id ? null : id
}
</script>

<template>
  <div class="flex flex-col h-screen">
    <AppNav
      :vessel-count="vessels.length"
      :countdown="countdown"
      :is-syncing="isSyncing"
      @sync="syncNow"
    />

    <div class="flex flex-1 overflow-hidden">
      <VesselSidebar
        :vessels="vessels"
        :selected-id="selectedId"
        @select="onSidebarSelect"
      />

      <div class="relative flex-1">
        <MapView
          :vessels="vessels"
          :selected-id="selectedId"
          @vessel-click="onVesselClick"
          @update:zoom="z => zoom = z"
          @update:coords="c => coords = c"
        />
        <VesselPopup :vessel="vessels.find(v => v.id === selectedId) || null" @close="selectedId = null" />
      </div>
    </div>

    <AppStatusBar :zoom="zoom" :coords="coords" />
  </div>
</template>
