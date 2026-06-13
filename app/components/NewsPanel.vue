<script setup>
import { useNewsStore } from '~/stores/news'

const { items, loading } = storeToRefs(useNewsStore())

function open(link) {
  if (link) window.open(link, '_blank', 'noopener,noreferrer')
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

    <div v-if="loading && !items.length" class="flex items-center gap-2 text-xs text-muted py-4">
      <UIcon name="i-lucide-loader" class="w-3.5 h-3.5 animate-spin" />
      Loading news…
    </div>

    <div v-else-if="items.length" class="space-y-1">
      <div
        v-for="item in items"
        :key="item.id"
        class="p-2.5 rounded-lg hover:bg-elevated transition-colors"
        :class="item.link ? 'cursor-pointer' : ''"
        @click="open(item.link)"
      >
        <div class="flex items-center gap-2 mb-1.5">
          <span class="text-[9px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded border text-primary bg-primary/15 border-primary/30 truncate max-w-[8rem]">
            {{ item.source }}
          </span>
          <span class="text-[10px] text-muted ml-auto font-mono shrink-0">{{ item.time }}</span>
        </div>
        <p class="text-[11px] leading-relaxed text-muted">{{ item.title }}</p>
      </div>
    </div>

    <div v-else class="text-xs text-muted py-4">No news available.</div>
  </div>
</template>
