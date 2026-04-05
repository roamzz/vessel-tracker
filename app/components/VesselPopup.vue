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
    class="absolute bottom-6 left-6 z-10 w-64"
  >
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-semibold">{{ vessel.name }}</span>
          <UButton
            icon="i-lucide-x"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="$emit('close')"
          />
        </div>
      </template>

      <dl class="space-y-2 text-sm">
        <div class="flex justify-between">
          <dt class="text-muted">
            Type
          </dt>
          <dd class="capitalize">
            {{ vessel.type }}
          </dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-muted">
            Speed
          </dt>
          <dd>
            {{ vessel.speed }} kn
          </dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-muted">
            Heading
          </dt>
          <dd>
            {{ vessel.heading }}°
          </dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-muted">
            MMSI
          </dt>
          <dd class="font-mono">
            {{ vessel.id }}
          </dd>
        </div>
      </dl>
    </UCard>
  </div>
</template>
