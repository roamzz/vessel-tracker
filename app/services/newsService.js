import { relativeTime } from '~/utils/time'

export async function fetchNews({ limit = 20, offset = 0 } = {}) {
  return useApi()('/news/news', { params: { limit, offset, order_by: 'published_at', direction: 'desc' } })
}

export function mapNewsItem(item) {
  return {
    id:     item.id,
    title:  item.title  ?? 'Untitled',
    source: item.source ?? 'Unknown',
    link:   item.link   ?? null,
    time:   item.published_at ? relativeTime(item.published_at) : '—',
  }
}
