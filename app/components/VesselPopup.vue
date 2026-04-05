<script setup>
defineProps({
  vessel: {
    type: Object,
    default: null
  }
})

defineEmits(["close"])
</script>

<template>
  <div
    v-if="vessel"
    class="absolute -translate-x-1/2 -translate-y-full -mt-4 w-52 pointer-events-auto"
  >
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-semibold text-sm">{{ vessel.name }}</span>
          <UButton icon="i-lucide-x" size="xs" color="neutral" variant="ghost" @click="$emit('close')" />
        </div>
      </template>

      <dl class="space-y-1 text-xs">
        <div class="flex justify-between">
          <dt class="text-muted">Type</dt>
          <dd class="capitalize">{{ vessel.type }}</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-muted">Speed</dt>
          <dd>{{ vessel.speed.toFixed(1) }} kn</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-muted">Heading</dt>
          <dd>{{ vessel.heading }}°</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-muted">MMSI</dt>
          <dd class="font-mono">{{ vessel.id }}</dd>
        </div>
      </dl>
    </UCard>
  </div>
</template>
