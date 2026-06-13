<script setup>
const news = [
  { id: 1, category: "Alert",    title: "Strong winds expected in Aegean — NE 5-6 Beaufort",              time: "2m ago",  urgent: true  },
  { id: 2, category: "Port",     title: "Piraeus berths 14-18 congestion delays expected until 18:00",     time: "18m ago", urgent: false },
  { id: 3, category: "Maritime", title: "IMO announces updated ballast water regulations",                  time: "1h ago",  urgent: false },
  { id: 4, category: "Weather",  title: "Cyclone watch lifted for Eastern Mediterranean",                   time: "2h ago",  urgent: false },
  { id: 5, category: "Port",     title: "Thessaloniki terminal 3 reopens after scheduled maintenance",      time: "3h ago",  urgent: false },
  { id: 6, category: "Maritime", title: "New AIS reporting requirements effective for vessels >300 GT",     time: "5h ago",  urgent: false }
]

const BADGE = {
  Alert:    "text-red-600 dark:text-red-400 bg-red-500/15 border-red-500/30",
  Port:     "text-primary bg-primary/15 border-primary/30",
  Maritime: "text-violet-600 dark:text-violet-400 bg-violet-500/15 border-violet-500/30",
  Weather:  "text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/30"
}
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-3">
      <p class="text-[10px] text-muted uppercase tracking-widest font-medium">News</p>
      <div class="flex items-center gap-1.5 text-[10px] text-muted">
        <span class="relative flex size-1.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
          <span class="relative inline-flex rounded-full size-1.5 bg-success" />
        </span>
        Live
      </div>
    </div>

    <div class="space-y-1">
      <div
        v-for="item in news"
        :key="item.id"
        class="p-2.5 rounded-lg hover:bg-elevated transition-colors cursor-pointer"
        :class="item.urgent ? 'bg-red-500/8 dark:bg-red-500/5 border border-red-500/25 dark:border-red-500/15' : ''"
      >
        <div class="flex items-center gap-2 mb-1.5">
          <span
            class="text-[9px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded border"
            :class="BADGE[item.category]"
          >
            {{ item.category }}
          </span>
          <span class="text-[10px] text-muted ml-auto font-mono">{{ item.time }}</span>
        </div>
        <p
          class="text-[11px] leading-relaxed"
          :class="item.urgent ? 'text-default font-medium' : 'text-muted'"
        >
          {{ item.title }}
        </p>
      </div>
    </div>
  </div>
</template>
