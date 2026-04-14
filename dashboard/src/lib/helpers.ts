export const safeNum = (val: any, fallback = 0): number => {
  const n = Number(val)
  return Number.isFinite(n) ? n : fallback
}

export const safeDivide = (a: any, b: any, fallback = 0): number => {
  const num = safeNum(a)
  const den = safeNum(b)
  return den === 0 ? fallback : num / den
}

export const fmt = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n)

export const fmtPct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`

export const daysUntil = (dateStr: string | null | undefined): number => {
  if (!dateStr || typeof dateStr !== "string") return 0
  // Handle both ISO and DD.MM.YYYY formats
  let date: Date
  if (dateStr.includes("-")) {
    date = new Date(dateStr)
  } else {
    const parts = dateStr.split(".")
    if (parts.length !== 3) return 0
    const [d, m, y] = parts
    date = new Date(`${y}-${m}-${d}`)
  }
  if (isNaN(date.getTime())) return 0
  return Math.ceil((date.getTime() - Date.now()) / 86400000)
}

export const GRAY_MUTED = "#6b7280"
export const GRAY_MID = "#9ca3af"
export const GRAY_FAINT = "#3a3e48"

export const TYPE_COLORS: Record<string, string> = {
  ETF: "#5B8C5A", ETC: "#E8DCC8", Aktie: "#4A90A4",
  Krypto: "#7B68EE", "P2P": "#D4A574", Edelmetall: "#FFD700",
  "Private Equity": "#9B59B6",
}

export const urgencyOrder: Record<string, number> = { red: 0, yellow: 1, green: 2 }
export const urgencyColors: Record<string, string> = { red: "#D45B5B", yellow: "#C9A84C", green: "#5B8C5A" }
