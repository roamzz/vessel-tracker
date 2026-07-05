<script setup>
import { useTickerStore } from "~/stores/ticker"

const tickerStore = useTickerStore()
const { ticks } = storeToRefs(tickerStore)

const containerRef = ref(null)
const trackRef = ref(null)
const duration = ref(30) // seconds
const startPx = ref(0)
const endPx = ref(0)
const batchKey = ref(0)

// The track should start just past the container's right edge and end once
// it's fully past the left edge — not offset by the track's own (much larger)
// width, or it takes minutes before anything scrolls into view. Recomputed per
// batch so px/s stays constant regardless of how wide the batch is.
const SPEED_PX_PER_SEC = 200
async function recalcGeometry() {
  await nextTick()
  if (!containerRef.value || !trackRef.value) return
  const containerWidth = containerRef.value.clientWidth
  const trackWidth = trackRef.value.scrollWidth
  startPx.value = containerWidth
  endPx.value = -trackWidth
  duration.value = Math.max(5, (containerWidth + trackWidth) / SPEED_PX_PER_SEC)
  // Bump the key so the next batch gets a brand-new element instead of having
  // its duration/vars mutated on an already-running animation — browsers
  // reinterpret the elapsed time against the new duration in that case, which
  // can "catch up" by firing several animationend events almost instantly.
  batchKey.value++
}
watch(ticks, recalcGeometry)

onMounted(() => tickerStore.start())

function formatPrice(n) {
  return Number.isFinite(n) ? n.toFixed(5) : "—"
}

function priceClass(direction) {
  if (direction === "up") return "text-success"
  if (direction === "down") return "text-error"
  return "text-default"
}
</script>

<template>
  <div ref="containerRef" class="shrink-0 border-t border-default h-7 overflow-hidden relative">
    <div
      v-if="ticks.length"
      :key="batchKey"
      ref="trackRef"
      class="animate-ticker absolute inset-y-0 flex items-center gap-6 whitespace-nowrap text-xs font-mono px-4"
      :style="{
        animationDuration: duration + 's',
        '--ticker-start': startPx + 'px',
        '--ticker-end': endPx + 'px'
      }"
      @animationend="tickerStore.onBatchExhausted()"
    >
      <template v-for="(t, i) in ticks" :key="t.id">
        <span class="text-muted">
          <span class="text-default font-semibold">{{ t.instrument.toUpperCase() }}</span>
          <span class="ml-2" :class="priceClass(t.direction)">{{ formatPrice(t.price) }}</span>
          <span class="ml-1.5 text-[10px]">{{
            `bid ${formatPrice(t.bid)} · ask ${formatPrice(t.ask)}`
          }}</span>
        </span>
        <span v-if="i < ticks.length - 1" class="text-muted/40 select-none">•</span>
      </template>
    </div>
    <p v-else class="px-3 h-full flex items-center text-xs text-muted">Loading market ticker…</p>
  </div>
</template>

<style scoped>
@keyframes ticker-scroll {
  from {
    transform: translateX(var(--ticker-start, 100%));
  }
  to {
    transform: translateX(var(--ticker-end, -100%));
  }
}

.animate-ticker {
  animation-name: ticker-scroll;
  animation-timing-function: linear;
  animation-iteration-count: 1;
}
</style>
