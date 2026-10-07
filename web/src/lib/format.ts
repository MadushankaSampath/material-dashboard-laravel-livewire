const moneyFormatters = new Map<string, Intl.NumberFormat>()

export function money(amount: number, currency: string): string {
  let f = moneyFormatters.get(currency)
  if (!f) {
    try {
      f = new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 2 })
    } catch {
      f = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
    moneyFormatters.set(currency, f)
  }
  return f.format(amount)
}

/** Whole number without currency symbol, for tight summary tiles. */
export function amount(n: number): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n)
}

/** Local calendar date as YYYY-MM-DD (the Data Connect `Date` format). */
export function isoDate(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function parseIsoDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function monthRange(year: number, month: number): { from: string; to: string } {
  return { from: isoDate(new Date(year, month, 1)), to: isoDate(new Date(year, month + 1, 0)) }
}

export function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

export function dayLabel(s: string): string {
  const today = isoDate()
  const yesterday = isoDate(new Date(Date.now() - 86_400_000))
  if (s === today) return 'Today'
  if (s === yesterday) return 'Yesterday'
  return parseIsoDate(s).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
}

export function shortDate(s: string | null | undefined): string {
  if (!s) return '—'
  return parseIsoDate(s).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

export function errorMessage(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e)
  // SQL Connect: "DataConnect error while performing request: [{"message":"Invite code not found (aborted)\n..."
  const dc = msg.match(/"message":"(.*?)(?:\s*\(aborted\))?(?:\\n|")/)
  if (dc) return dc[1]
  return msg.replace(/^Firebase:\s*/, '').replace(/\s*\(auth\/[\w-]+\)\.?$/, '')
}

/** Readable, unambiguous invite code (no 0/O/1/I). */
export function newInviteCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')
}
