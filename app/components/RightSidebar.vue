<script setup>

const splitPercent = ref(48)
const isDragging = ref(false)
const containerRef = ref(null)

function startDrag(e) {
  isDragging.value = true
  e.preventDefault()
}

function onMouseMove(e) {
  if (!isDragging.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  splitPercent.value = Math.min(75, Math.max(25, ((e.clientY - rect.top) / rect.height) * 100))
}

function stopDrag() {
  isDragging.value = false
}

onMounted(() => {
  window.addEventListener("mousemove", onMouseMove)
  window.addEventListener("mouseup", stopDrag)
})

onUnmounted(() => {
  window.removeEventListener("mousemove", onMouseMove)
  window.removeEventListener("mouseup", stopDrag)
})
</script>

<template>
  <div
    ref="containerRef"
    class="w-80 h-full flex flex-col border-l border-default"
    :class="isDragging ? 'select-none cursor-row-resize' : ''"
  >
    <!-- Weather section -->
    <div class="flex flex-col min-h-0 overflow-hidden" :style="{ height: splitPercent + '%' }">
      <div class="overflow-y-auto flex-1 min-h-0">
        <WeatherPanel />
      </div>
    </div>

    <!-- Drag handle: thin grip-only divider, no text -->
    <div
      class="shrink-0 h-3 flex items-center justify-center cursor-row-resize group border-y border-default transition-colors hover:bg-primary/5"
      :class="isDragging ? 'bg-primary/5 border-primary/20' : 'bg-elevated/40'"
      @mousedown="startDrag"
    >
      <UIcon name="i-lucide-grip-horizontal" class="w-4 h-4 text-muted/30 group-hover:text-primary/50 transition-colors" />
    </div>

    <!-- News section -->
    <div class="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div class="overflow-y-auto flex-1 min-h-0">
        <NewsPanel />
      </div>
    </div>
  </div>
</template>
