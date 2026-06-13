<script setup>
const weather = {
  location: "Aegean Sea",
  temp: 24,
  feelsLike: 26,
  condition: "Partly Cloudy",
  conditionIcon: "i-lucide-cloud-sun",
  wind: { speed: 15, dir: "NE" },
  waveHeight: 0.8,
  visibility: 28,
  pressure: 1018,
  humidity: 62,
  updatedAt: "14:23 UTC"
}
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center justify-between">
      <p class="text-[10px] text-muted uppercase tracking-widest font-medium">Weather</p>
      <span class="text-[10px] text-muted font-mono">{{ weather.updatedAt }}</span>
    </div>

    <div class="flex items-start justify-between">
      <div>
        <div class="flex items-start gap-0.5">
          <span class="text-4xl font-extralight tracking-tight">{{ weather.temp }}</span>
          <span class="text-lg text-muted mt-1">°C</span>
        </div>
        <p class="text-xs text-muted mt-0.5">Feels like {{ weather.feelsLike }}°C</p>
        <div class="flex items-center gap-1.5 mt-2">
          <UIcon :name="weather.conditionIcon" class="w-3.5 h-3.5 text-primary" />
          <span class="text-xs font-medium">{{ weather.condition }}</span>
        </div>
      </div>
      <UIcon :name="weather.conditionIcon" class="w-12 h-12 text-primary/40 mt-0.5 shrink-0" />
    </div>

    <div class="flex items-center gap-1.5 text-[11px] text-muted">
      <UIcon name="i-lucide-map-pin" class="w-3 h-3 shrink-0" />
      <span>{{ weather.location }}</span>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div
        v-for="metric in [
          { label: 'Wind', value: weather.wind.speed, unit: 'kn ' + weather.wind.dir },
          { label: 'Waves', value: weather.waveHeight, unit: 'm sig.' },
          { label: 'Visibility', value: weather.visibility, unit: 'nm' },
          { label: 'Pressure', value: weather.pressure, unit: 'hPa' }
        ]"
        :key="metric.label"
        class="rounded-lg bg-elevated border border-default p-2.5"
      >
        <p class="text-[9px] text-muted uppercase tracking-widest mb-1.5">{{ metric.label }}</p>
        <div class="flex items-baseline gap-1">
          <span class="text-xl font-semibold">{{ metric.value }}</span>
          <span class="text-[11px] text-muted">{{ metric.unit }}</span>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3 text-[11px]">
      <span class="text-muted shrink-0">Humidity</span>
      <div class="flex-1 h-px bg-muted/40 rounded-full overflow-hidden">
        <div class="h-full bg-primary rounded-full" :style="{ width: weather.humidity + '%' }" />
      </div>
      <span class="font-mono text-muted shrink-0">{{ weather.humidity }}%</span>
    </div>
  </div>
</template>
