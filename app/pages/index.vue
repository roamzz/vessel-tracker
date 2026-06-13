<script setup>
import { useVesselStore } from '~/stores/vessels'
import { usePanels } from '~/composables/usePanels'

const store = useVesselStore()
const { vessels, countdown, pollInterval, isSyncing } = storeToRefs(store)
const { leftOpen, rightOpen } = usePanels()

const selectedId = ref(null)
const zoom = ref(7)
const coords = ref('Move cursor over map')
const mapRef = ref(null)

const selectedVessel = computed(() => vessels.value.find(v => v.id === selectedId.value) || null)

// Fit map to vessel bounds once on first successful load
let fitted = false
watch(vessels, (list) => {
  if (!fitted && list.length > 0) {
    fitted = true
    nextTick(() => mapRef.value?.fitBounds(list))
  }
})

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

onMounted(() => store.startPolling())
onUnmounted(() => store.stopPolling())
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <AppNav
      :vessel-count="vessels.length"
      :countdown="countdown"
      :is-syncing="isSyncing"
      @sync="store.sync()"
    />

    <div class="flex flex-1 overflow-hidden">
      <!-- Left: vessel sidebar -->
      <div
        class="overflow-hidden transition-all duration-300 ease-in-out h-full shrink-0 z-20"
        :class="leftOpen ? 'w-72' : 'w-0'"
      >
        <VesselSidebar :vessels="vessels" :selected-id="selectedId" @select="onSidebarSelect" @toggle="leftOpen = false" />
      </div>

      <!-- Center: map + floating reopen buttons -->
      <div class="relative flex-1 min-w-0">
        <Transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-500" leave-to-class="opacity-0">
          <div v-if="isSyncing" class="absolute top-0 inset-x-0 h-0.5 z-40 overflow-hidden">
            <div class="h-full w-1/3 bg-primary rounded-full [animation:map-loading_1.4s_ease-in-out_infinite]" />
          </div>
        </Transition>
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 -translate-x-2"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 -translate-x-2"
        >
          <button
            v-if="!leftOpen"
            class="absolute left-3 top-3 z-30 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-default bg-elevated/80 backdrop-blur-sm shadow-md text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
            @click="leftOpen = true"
          >
            <UIcon name="i-lucide-panel-left" class="w-3.5 h-3.5" />
            Vessels
          </button>
        </Transition>

        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 translate-x-2"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 translate-x-2"
        >
          <button
            v-if="!rightOpen"
            class="absolute right-3 top-3 z-30 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-default bg-elevated/80 backdrop-blur-sm shadow-md text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
            @click="rightOpen = true"
          >
            Weather & News
            <UIcon name="i-lucide-panel-right" class="w-3.5 h-3.5" />
          </button>
        </Transition>

        <MapView
          ref="mapRef"
          :vessels="vessels"
          :selected-id="selectedId"
          @vessel-click="onVesselClick"
          @update:zoom="(z) => (zoom = z)"
          @update:coords="(c) => (coords = c)"
        >
          <template #popup>
            <VesselPopup :vessel="selectedVessel" @close="selectedId = null" />
          </template>
        </MapView>
      </div>

      <!-- Right: right sidebar -->
      <div
        class="overflow-hidden transition-all duration-300 ease-in-out h-full shrink-0 z-20"
        :class="rightOpen ? 'w-80' : 'w-0'"
      >
        <RightSidebar @toggle="rightOpen = false" />
      </div>
    </div>

    <AppStatusBar :zoom="zoom" :coords="coords" />
  </div>
</template>
