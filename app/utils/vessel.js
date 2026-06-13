export const VESSEL_COLORS = {
  cargo:     '#60a5fa',
  tanker:    '#fbbf24',
  passenger: '#34d399',
}

export function inferVesselType(code) {
  if (code >= 60 && code <= 69) return 'passenger'
  if (code >= 80 && code <= 89) return 'tanker'
  return 'cargo'
}
