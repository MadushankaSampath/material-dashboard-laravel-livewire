import { CC_PAYMENT, type Entry } from './types'

export interface Summary {
  income: number
  /** Real spending: excludes credit-card payments (the purchases were already counted). */
  spent: number
  cardPayments: number
  byCategory: { name: string; icon: string; total: number }[]
}

export function summarise(entries: Entry[]): Summary {
  let income = 0
  let spent = 0
  let cardPayments = 0
  const cats = new Map<string, { name: string; icon: string; total: number }>()
  for (const e of entries) {
    if (e.kind === 'INCOME') {
      income += e.amount
      continue
    }
    if (e.category?.systemKey === CC_PAYMENT) {
      cardPayments += e.amount
      continue
    }
    spent += e.amount
    const key = e.category?.id ?? 'none'
    const c = cats.get(key) ?? { name: e.category?.name ?? 'Uncategorised', icon: e.category?.icon ?? '•', total: 0 }
    c.total += e.amount
    cats.set(key, c)
  }
  return { income, spent, cardPayments, byCategory: [...cats.values()].sort((a, b) => b.total - a.total) }
}
