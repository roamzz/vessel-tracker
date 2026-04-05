<script setup>
// VesselSidebar.vue
// Left sidebar — searchable, filterable list of all vessels.
// Clicking a vessel emits 'select' with the vessel id, which triggers map animation + popup.
//
// Props:
//   vessels    — full vessel array from useVessels
//   selectedId — currently selected vessel id (highlights the active row)
//
// Emits:
//   select(id) — vessel id when a row is clicked
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

const emit = defineEmits(["select"])

const search = ref("")
const filterType = ref("all")

const types = [
  { label: "All", value: "all" },
  { label: "Cargo", value: "cargo" },
  { label: "Tanker", value: "tanker" },
  { label: "Passenger", value: "passenger" }
]

// Filters vessels by type chip and search query (matches name or MMSI)
const filtered = computed(() => {
  return props.vessels.filter(v => {
    const matchType = filterType.value === "all" || v.type === filterType.value
    const q = search.value.trim().toUpperCase()
    const matchSearch = !q || v.name.includes(q) || v.id.includes(q)
    return matchType && matchSearch
  })
})

// Color dot per vessel type — mirrors the marker colors on the map
const TYPE_COLOR = {
  cargo: "text-info",
  tanker: "text-warning",
  passenger: "text-success"
}
</script>

<template>
  <aside class="w-72 border-r border-default flex flex-col shrink-0 z-20">
    <div class="p-3 border-b border-default space-y-2">
      <p class="text-xs text-muted uppercase tracking-wider">
        Vessels · {{ filtered.length }}
      </p>

      <UInput v-model="search" placeholder="Search name or MMSI…" icon="i-lucide-search" size="sm" />

      <div class="flex gap-1 flex-wrap">
        <UButton
          v-for="t in types"
          :key="t.value"
          size="xs"
          :variant="filterType === t.value ? 'solid' : 'outline'"
          color="neutral"
          @click="filterType = t.value"
        >
          {{ t.label }}
        </UButton>
      </div>
    </div>

    <ul class="flex-1 overflow-y-auto">
      <li
        v-for="v in filtered"
        :key="v.id"
        class="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-elevated border-l-2 transition-colors"
        :class="selectedId === v.id ? 'border-primary bg-elevated' : 'border-transparent'"
        @click="emit('select', v.id)"
      >
        <span class="size-2 rounded-full shrink-0" :class="TYPE_COLOR[v.type] || 'text-muted'" style="background: currentColor" />
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold truncate">{{ v.name }}</p>
          <p class="text-xs text-muted font-mono">{{ v.id.slice(0, 9) }} · {{ v.type.toUpperCase() }}</p>
        </div>
        <span class="text-xs font-mono shrink-0" :class="selectedId === v.id ? 'text-primary' : 'text-muted'">
          {{ v.speed.toFixed(1) }} kn
        </span>
      </li>
    </ul>
  </aside>
</template>
