export async function fetchMessages({ limit = 50, offset = 0 } = {}) {
  return useApi()('/lmax/messages', {
    params: {
      message_type: 'TICKER',
      order_by: 'timestamp',
      direction: 'desc',
      limit,
      offset,
    }
  })
}

export function mapTick(msg, direction = 'flat') {
  return {
    id:         msg.id,
    instrument: msg.instrument_id ?? msg.payload?.instrument_id ?? '—',
    price:      Number(msg.payload?.last_price),
    bid:        Number(msg.payload?.best_bid),
    ask:        Number(msg.payload?.best_ask),
    direction, // 'up' | 'down' | 'flat' — relative to the previous tick for this instrument
  }
}
