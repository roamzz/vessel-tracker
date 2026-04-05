<script setup>
const props = defineProps({
  zoom: {
    type: Number,
    default: 7
  },
  coords: {
    type: String,
    default: "Move cursor over map"
  },
  countdown: {
    type: Number,
    default: 10
  },
  pollInterval: {
    type: Number,
    default: 10
  }
})

const progress = computed(() => (props.countdown / props.pollInterval) * 100)
</script>

<template>
  <div class="shrink-0 border-t border-default z-30">
    <div class="h-0.5 w-full bg-muted/20">
      <div
        class="h-full bg-primary transition-all duration-1000 ease-linear"
        :style="{ width: `${progress}%` }"
      />
    </div>
    <div class="flex items-center gap-3 px-4 h-7 text-xs text-muted font-mono">
      <span>Zoom: {{ zoom.toFixed(1) }}</span>
      <USeparator orientation="vertical" class="h-3" />
      <span>{{ coords }}</span>
      <USeparator orientation="vertical" class="h-3" />
      <span>WebGL · OSM</span>
    </div>
  </div>
</template>
