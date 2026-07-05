<script setup>
// import { VESSEL_COLORS } from '~/utils/vessel' -- unused while type is commented out below

defineProps({
  vessel: { type: Object, default: null }
})

defineEmits(['close'])

// type not available from the API yet
// const typeColor = computed(() => VESSEL_COLORS[props.vessel?.type] ?? VESSEL_COLORS.cargo)
</script>

<template>
  <div v-if="vessel" class="absolute -translate-x-1/2 -translate-y-full pointer-events-auto w-60">
    <div class="flex flex-col items-center drop-shadow-xl">

      <div class="w-full rounded-xl border border-default bg-elevated overflow-hidden">
        <!-- Header -->
        <div class="flex items-start justify-between gap-2 px-3 pt-3 pb-2">
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-sm truncate leading-tight">{{ vessel.name }}</p>
            <!-- Type badge hidden — API doesn't return ship_type yet
            <span
              class="inline-block text-[9px] font-bold uppercase tracking-widest mt-1.5 px-1.5 py-0.5 rounded"
              :style="{ color: typeColor, backgroundColor: typeColor + '22' }"
            >
              {{ vessel.type }}
            </span>
            -->
          </div>
          <button class="shrink-0 text-muted hover:text-default transition-colors mt-0.5 cursor-pointer" @click="$emit('close')">
            <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
          </button>
        </div>

        <div class="border-t border-default" />

        <!-- Metrics -->
        <!-- Speed/HDG hidden — API doesn't return sog/true_heading/cog yet
        <div class="grid grid-cols-3 text-center py-2.5">
          <div class="px-2 border-r border-default">
            <p class="text-[9px] text-muted uppercase tracking-widest">Speed</p>
            <p class="text-base font-semibold leading-none mt-1">{{ vessel.speed.toFixed(1) }}</p>
            <p class="text-[9px] text-muted mt-0.5">kn</p>
          </div>
          <div class="px-2 border-r border-default">
            <p class="text-[9px] text-muted uppercase tracking-widest">HDG</p>
            <p class="text-base font-semibold leading-none mt-1">{{ vessel.heading }}</p>
            <p class="text-[9px] text-muted mt-0.5">°true</p>
          </div>
          <div class="px-2">
            <p class="text-[9px] text-muted uppercase tracking-widest">MMSI</p>
            <p class="text-[10px] font-mono font-semibold leading-tight mt-1">{{ vessel.id }}</p>
          </div>
        </div>
        -->
        <div class="text-center py-2.5">
          <p class="text-[9px] text-muted uppercase tracking-widest">MMSI</p>
          <p class="text-[10px] font-mono font-semibold leading-tight mt-1">{{ vessel.id }}</p>
        </div>
      </div>

      <!-- Arrow pointing to vessel marker -->
      <div class="w-3 h-3 -mt-px rotate-45 border-r border-b border-default bg-elevated" />
    </div>
  </div>
</template>
