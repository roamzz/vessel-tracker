const TYPES = ["cargo", "cargo", "cargo", "tanker", "tanker", "passenger"]
const NAMES = [
  "MSC AURORA", "OLYMPIC SPIRIT", "BLUE STAR MYKONOS", "MEDITERRANEAN SKY",
  "AEGEAN HAWK", "POSEIDON CARRIER", "HELLENIC PRIDE", "KRONOS II",
  "ATLAS MARINER", "IONIAN SEA", "DELPHI STAR", "NAXOS EXPRESS",
  "TRITON GLORY", "CORFU QUEEN", "SPARTA TRADER", "CYCLADES WIND",
  "PIRAEUS PRIDE", "MARATHON SPIRIT", "THEMIS CARRIER", "ELECTRA SEA"
]

function generateVessels(count = 20) {
  return Array.from({ length: count }, (_, i) => {
    const type = TYPES[i % TYPES.length]
    const name = NAMES[i % NAMES.length] + (i >= NAMES.length ? ` ${Math.floor(i / NAMES.length) + 1}` : "")
    return {
      id: String(100000000 + i * 13456789),
      name,
      type,
      lat: 36.5 + Math.random() * 4.5,
      lon: 22.0 + Math.random() * 7,
      speed: type === "passenger" ? 15 + Math.random() * 10 : type === "tanker" ? 4 + Math.random() * 6 : 8 + Math.random() * 8,
      heading: Math.floor(Math.random() * 360),
      dlat: (Math.random() - 0.5) * 0.003,
      dlon: (Math.random() - 0.5) * 0.003
    }
  })
}

export function useVessels(count = 20) {
  const vessels = ref([])
  const pollInterval = 10
  const countdown = ref(pollInterval)
  const isSyncing = ref(false)

  function tick() {
    vessels.value = vessels.value.map(v => ({
      ...v,
      lat: Math.max(35, Math.min(42, v.lat + v.dlat)),
      lon: Math.max(20, Math.min(30, v.lon + v.dlon)),
      heading: (v.heading + (Math.random() * 4 - 2) + 360) % 360,
      speed: Math.max(1, Math.min(28, v.speed + (Math.random() - 0.5) * 0.3))
    }))
  }

  function syncNow() {
    isSyncing.value = true
    tick()
    setTimeout(() => {
      isSyncing.value = false
    }, 600)
    countdown.value = pollInterval
  }

  onMounted(() => {
    vessels.value = generateVessels(count)

    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        syncNow()
        countdown.value = pollInterval
      }
    }, 1000)

    onUnmounted(() => clearInterval(timer))
  })

  return { vessels, countdown, pollInterval, isSyncing, syncNow }
}
