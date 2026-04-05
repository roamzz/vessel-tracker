<script setup>
// AppNav.vue
// Top navigation bar — shows the app logo, live poll status, vessel count, and sync button.
//
// Props:
//   vesselCount — total number of vessels currently loaded
//   countdown   — seconds until the next automatic sync
//   isSyncing   — true while a sync is in progress (shows spinner on button)
//
// Emits:
//   sync — when the SYNC button is clicked (triggers immediate poll in useVessels)
defineProps({
  vesselCount: {
    type: Number,
    default: 0
  },
  countdown: {
    type: Number,
    default: 10
  },
  isSyncing: {
    type: Boolean,
    default: false
  }
})

defineEmits(["sync"])
</script>

<template>
  <nav class="flex items-center gap-4 px-4 h-12 border-b border-default shrink-0 z-30">
    <NuxtLink to="/" class="flex items-center gap-2 font-bold text-sm text-primary">
      <UIcon name="i-lucide-ship" class="w-5 h-5" />
      VesselTrack
    </NuxtLink>

    <USeparator orientation="vertical" class="h-5" />

    <div class="flex items-center gap-2 text-xs text-muted">
      <span class="relative flex size-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
        <span class="relative inline-flex rounded-full size-2 bg-success" />
      </span>
      LIVE · next poll <span class="font-bold text-default">{{ countdown }}s</span>
    </div>

    <div class="ml-auto flex items-center gap-4">
      <div class="text-xs text-muted flex flex-col items-end">
        <span>VESSELS</span>
        <span class="font-bold text-primary text-sm leading-none">{{ vesselCount }}</span>
      </div>

      <UButton size="sm" color="neutral" variant="outline" :loading="isSyncing" icon="i-lucide-refresh-cw" @click="$emit('sync')">
        SYNC
      </UButton>
    </div>
  </nav>
</template>
