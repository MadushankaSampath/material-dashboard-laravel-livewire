import type { GetMyHomeData, ListEntriesData } from '@pocketbook/dataconnect'

export type Household = NonNullable<GetMyHomeData['member']>['household']
export type PaymentMethod = Household['paymentMethods'][number]
export type Category = Household['categories'][number]
export type Member = Household['members'][number]
export type Entry = NonNullable<ListEntriesData['member']>['household']['entries'][number]

export type EntryKind = 'EXPENSE' | 'INCOME'

export const PAYMENT_TYPES = [
  { value: 'CASH', label: 'Cash', icon: '💵' },
  { value: 'BANK', label: 'Bank / Transfer', icon: '🏦' },
  { value: 'CREDIT_CARD', label: 'Credit card', icon: '💳' },
  { value: 'WALLET', label: 'e-Wallet', icon: '📱' },
  { value: 'OTHER', label: 'Other', icon: '🔖' },
] as const

export function paymentIcon(type: string): string {
  return PAYMENT_TYPES.find((t) => t.value === type)?.icon ?? '🔖'
}

export const CC_PAYMENT = 'CC_PAYMENT'

export const CURRENCIES = ['LKR', 'USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'SGD', 'AED', 'JPY']
