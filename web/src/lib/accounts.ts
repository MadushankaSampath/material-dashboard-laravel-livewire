import { isoDate } from './format'
import type { Entry, PaymentMethod } from './types'

// Bank accounts, cash and e-wallets can track a balance. They reuse the payment
// method's lastStatementBalance / lastStatementDate fields as "balance on date",
// so no schema change is needed:
//   balance = known balance + income received into it − expenses paid from it, after that date.

export const BALANCE_TYPES = ['BANK', 'WALLET', 'CASH'] as const

export function canTrackBalance(m: PaymentMethod): boolean {
  return (BALANCE_TYPES as readonly string[]).includes(m.type)
}

export function tracksBalance(m: PaymentMethod): boolean {
  return canTrackBalance(m) && !!m.lastStatementDate
}

export interface AccountStatus {
  account: PaymentMethod
  asOf: string
  known: number
  moneyIn: number
  moneyOut: number
  balance: number
}

/** Earliest balance date across accounts: entries are needed from then on. */
export function accountsSince(accounts: PaymentMethod[]): string {
  const dates = accounts.map((a) => a.lastStatementDate).filter((d): d is string => !!d)
  return dates.length ? dates.sort()[0] : isoDate()
}

function flows(account: PaymentMethod, entries: Entry[], after: string, upTo: string) {
  let moneyIn = 0
  let moneyOut = 0
  for (const e of entries) {
    if (e.paymentMethod?.id !== account.id || e.date <= after || e.date > upTo) continue
    if (e.kind === 'INCOME') moneyIn += e.amount
    else moneyOut += e.amount
  }
  return { moneyIn, moneyOut }
}

export function accountStatus(account: PaymentMethod, entries: Entry[], today: string = isoDate()): AccountStatus {
  const asOf = account.lastStatementDate ?? today
  const known = account.lastStatementBalance ?? 0
  // Entries dated on the balance day are assumed to be included in that balance.
  const { moneyIn, moneyOut } = flows(account, entries, asOf, '9999-12-31')
  return { account, asOf, known, moneyIn, moneyOut, balance: known + moneyIn - moneyOut }
}

export interface BalanceCheck {
  previous: number
  moneyIn: number
  moneyOut: number
  expected: number
}

/** What the app expects the account to hold on `date`, from the last known balance. */
export function expectedBalance(account: PaymentMethod, entries: Entry[], date: string): BalanceCheck | null {
  if (!account.lastStatementDate || date <= account.lastStatementDate) return null
  const previous = account.lastStatementBalance ?? 0
  const { moneyIn, moneyOut } = flows(account, entries, account.lastStatementDate, date)
  return { previous, moneyIn, moneyOut, expected: previous + moneyIn - moneyOut }
}
