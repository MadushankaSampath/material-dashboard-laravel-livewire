import type { CardActivityData } from '@pocketbook/dataconnect'
import { isoDate, parseIsoDate } from './format'
import type { InstallmentPlan, PaymentMethod } from './types'

export interface CardStatus {
  card: PaymentMethod
  limit: number
  /** Last statement balance + charges since - refunds since - payments since. */
  balance: number
  /** Unbilled instalment-plan amounts the bank holds against the limit. */
  blocked: number
  available: number
  newCharges: number
  paidSince: number
  utilisation: number
}

export interface PlanStatus {
  plan: InstallmentPlan
  monthly: number
  billed: number
  remaining: number
}

/** Same day `n` months earlier, clamped to the month's last day (31 Mar → 28/29 Feb). */
function monthsBefore(d: Date, n: number): Date {
  const target = new Date(d.getFullYear(), d.getMonth() - n, 1)
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  target.setDate(Math.min(d.getDate(), lastDay))
  return target
}

/**
 * One instalment is billed on every statement after the plan starts. Statements
 * fall monthly on the card's last statement day; up to that statement the
 * billed instalments are already inside the statement balance, so only the
 * rest is still blocked.
 */
export function planStatus(plan: InstallmentPlan, lastStatementDate: string | null | undefined): PlanStatus {
  const monthly = plan.months > 0 ? plan.totalAmount / plan.months : plan.totalAmount
  const ref = parseIsoDate(lastStatementDate ?? isoDate())
  const start = parseIsoDate(plan.startDate)
  let billed = 0
  while (billed < plan.months && monthsBefore(ref, billed) > start) billed++
  const remaining = billed >= plan.months ? 0 : Math.max(0, plan.totalAmount - monthly * billed)
  return { plan, monthly, billed, remaining }
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
    // `?? []` keeps the app working if the site is deployed before the SQL Connect connector.
    const blocked = (card.installmentPlans ?? []).reduce((s, p) => s + planStatus(p, card.lastStatementDate).remaining, 0)
    return {
      card,
      limit,
      balance,
      blocked,
      available: limit - balance - blocked,
      newCharges,
      paidSince,
      utilisation: limit > 0 ? Math.min(1, Math.max(0, (balance + blocked) / limit)) : 0,
    }
  })
}
