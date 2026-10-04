import type { CardActivityData } from '@pocketbook/dataconnect'
import type { PaymentMethod } from './types'

export interface CardStatus {
  card: PaymentMethod
  limit: number
  /** Last statement balance + charges since - refunds since - payments since. */
  balance: number
  available: number
  newCharges: number
  paidSince: number
  utilisation: number
}

/** Earliest date we need activity from to compute every card's balance. */
export function activitySince(cards: PaymentMethod[]): string {
  const dates = cards.map((c) => c.lastStatementDate).filter((d): d is string => !!d)
  return dates.length ? dates.sort()[0] : '1970-01-01'
}

export function cardStatuses(cards: PaymentMethod[], activity: CardActivityData | undefined): CardStatus[] {
  const byId = new Map(activity?.member?.household.cards.map((c) => [c.id, c]))
  return cards.map((card) => {
    const a = byId.get(card.id)
    // Entries dated on the statement day are assumed to be on that statement.
    const after = (rows: { amount: number; date: string }[] | undefined) =>
      (rows ?? [])
        .filter((r) => !card.lastStatementDate || r.date > card.lastStatementDate)
        .reduce((s, r) => s + r.amount, 0)
    const newCharges = after(a?.charges)
    const paidSince = after(a?.payments) + after(a?.refunds)
    const limit = card.creditLimit ?? 0
    const balance = (card.lastStatementBalance ?? 0) + newCharges - paidSince
    return {
      card,
      limit,
      balance,
      available: limit - balance,
      newCharges,
      paidSince,
      utilisation: limit > 0 ? Math.min(1, Math.max(0, balance / limit)) : 0,
    }
  })
}
