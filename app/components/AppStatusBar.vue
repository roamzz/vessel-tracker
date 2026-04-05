<script setup>
defineProps({
  zoom: {
    type: Number,
    default: 7
  },
  coords: {
    type: String,
    default: "Move cursor over map"
  }
})
</script>

<template>
  <div class="flex items-center gap-3 px-4 h-7 border-t border-default shrink-0 text-xs text-muted font-mono z-30">
    <span>Zoom: {{ zoom.toFixed(1) }}</span>
    <USeparator orientation="vertical" class="h-3" />
    <span>{{ coords }}</span>
    <USeparator orientation="vertical" class="h-3" />
    <span>WebGL · OSM</span>
  </div>
</template>
