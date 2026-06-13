export async function fetchNews({ limit = 20, offset = 0 } = {}) {
  const api = useApi()
  return api('/news/news', { params: { limit, offset, order_by: 'published_at', direction: 'desc' } })
}

export function mapNewsItem(item) {
  return {
    id:     item.id,
    title:  item.title ?? 'Untitled',
    source: item.source ?? 'Unknown',
    link:   item.link   ?? null,
    time:   item.published_at ? relativeTime(new Date(item.published_at)) : '—',
  }
}

function relativeTime(date) {
  const diff = Date.now() - date.getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins  <  1) return 'just now'
  if (mins  < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}
