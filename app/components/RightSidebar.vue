<script setup>
const emit = defineEmits(["toggle"])

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
    <div class="overflow-y-auto min-h-0" :style="{ height: splitPercent + '%' }">
      <div class="flex items-center justify-between px-4 pt-4 pb-1">
        <!-- <p class="text-[10px] text-muted uppercase tracking-widest font-medium">Info Panel</p> -->
        <UButton
          size="xs"
          color="neutral"
          variant="ghost"
          icon="i-lucide-panel-right-close"
          @click="emit('toggle')"
        />
      </div>
      <WeatherPanel />
    </div>

    <div
      class="shrink-0 border-y border-default flex items-center justify-between px-4 py-2 cursor-row-resize group hover:bg-primary/5 hover:border-primary/20 transition-colors"
      :class="isDragging ? 'bg-primary/5 border-primary/20' : 'bg-elevated/60'"
      @mousedown="startDrag"
    >
      <span
        class="text-[9px] uppercase tracking-widest text-muted group-hover:text-primary transition-colors font-medium"
        >News</span
      >
      <UIcon
        name="i-lucide-grip-horizontal"
        class="w-4 h-4 text-muted/50 group-hover:text-primary transition-colors"
      />
      <!-- <span
        class="text-[9px] uppercase tracking-widest text-muted group-hover:text-primary transition-colors font-medium"
        >drag</span
      > -->
    </div>

    <div class="overflow-y-auto flex-1 min-h-0">
      <NewsPanel />
    </div>
  </div>
</template>
