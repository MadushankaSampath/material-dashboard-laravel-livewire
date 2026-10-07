import { isoDate, parseIsoDate } from './format'
import { CC_PAYMENT, type Entry } from './types'

/** Real spending: expenses except credit-card payments (the purchases were already counted). */
export function spendingOnly(entries: Entry[]): Entry[] {
  return entries.filter((e) => e.kind === 'EXPENSE' && e.category?.systemKey !== CC_PAYMENT)
}

const sum = (rows: Entry[]) => rows.reduce((s, e) => s + e.amount, 0)

export interface Highlights {
  spent: number
  thisWeek: number
  dailyAverage: number
  projected: number
  /** Spending in the same days of last month (1st … today's day). */
  lastMonthSoFar: number
  /** Fractional change vs the same days last month; null when last month had none. */
  change: number | null
  biggest: Entry | null
  topCategory: { name: string; icon: string; share: number } | null
  byMember: { id: string; name: string; total: number }[]
}

export function highlights(thisMonth: Entry[], lastMonth: Entry[], now: Date = new Date()): Highlights {
  const spend = spendingOnly(thisMonth)
  const spent = sum(spend)
  const day = now.getDate()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

  // Week starts on Monday.
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7))
  const weekFrom = isoDate(monday)
  const thisWeek = sum(spend.filter((e) => e.date >= weekFrom))

  const dailyAverage = spent / day
  const lastMonthSoFar = sum(spendingOnly(lastMonth).filter((e) => parseIsoDate(e.date).getDate() <= day))
  const change = lastMonthSoFar > 0 ? (spent - lastMonthSoFar) / lastMonthSoFar : null

  const biggest = spend.reduce<Entry | null>((b, e) => (!b || e.amount > b.amount ? e : b), null)

  const cats = new Map<string, { name: string; icon: string; total: number }>()
  for (const e of spend) {
    const k = e.category?.id ?? 'none'
    const c = cats.get(k) ?? { name: e.category?.name ?? 'Uncategorised', icon: e.category?.icon ?? '•', total: 0 }
    c.total += e.amount
    cats.set(k, c)
  }
  const top = [...cats.values()].sort((a, b) => b.total - a.total)[0]

  const members = new Map<string, { id: string; name: string; total: number }>()
  for (const e of spend) {
    const m = members.get(e.createdBy.id) ?? { id: e.createdBy.id, name: e.createdBy.displayName, total: 0 }
    m.total += e.amount
    members.set(e.createdBy.id, m)
  }

  return {
    spent,
    thisWeek,
    dailyAverage,
    projected: dailyAverage * daysInMonth,
    lastMonthSoFar,
    change,
    biggest,
    topCategory: top && spent > 0 ? { name: top.name, icon: top.icon, share: top.total / spent } : null,
    byMember: [...members.values()].sort((a, b) => b.total - a.total),
  }
}
