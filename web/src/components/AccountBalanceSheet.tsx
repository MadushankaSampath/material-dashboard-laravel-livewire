import { useState, type FormEvent } from 'react'
import { addEntry, updatePaymentMethod } from '@pocketbook/dataconnect'
import { dc } from '../firebase'
import { expectedBalance } from '../lib/accounts'
import { ensureCategory } from '../lib/categories'
import { errorMessage, isoDate, money, shortDate } from '../lib/format'
import type { Entry, EntryKind, PaymentMethod } from '../lib/types'
import { useApp, useHousehold } from '../state/AppContext'
import { useBusy } from '../state/busy'

/** Ways to explain a gap between the bank and the app. */
const MORE_IN_BANK = [
  { name: 'Interest', icon: '💹', kind: 'INCOME' as EntryKind },
  { name: 'Other Income', icon: '💰', kind: 'INCOME' as EntryKind },
]
const LESS_IN_BANK = [
  { name: 'Bank Charges', icon: '🏦', kind: 'EXPENSE' as EntryKind },
  { name: 'Other', icon: '📦', kind: 'EXPENSE' as EntryKind },
]

const TOLERANCE = 0.5

/**
 * Enter the real balance of a bank account / cash / wallet. Compares it with what
 * the app expects from recorded entries, helps record the gap (interest, bank
 * charges) and saves it as the new known balance.
 */
export default function AccountBalanceSheet({
  account,
  entries,
  onClose,
}: {
  account: PaymentMethod
  /** Entries since the account's last known balance date. */
  entries: Entry[] | undefined
  onClose: () => void
}) {
  const { refreshHome, dataChanged } = useApp()
  const { categories, currency } = useHousehold()
  const [date, setDate] = useState(isoDate())
  const [balance, setBalance] = useState('')
  const [fixAmount, setFixAmount] = useState('')
  const [busy, setBusy] = useBusy()
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState<string[]>([])

  const actual = balance.trim() === '' ? null : Number(balance.replace(',', '.'))
  const check = actual !== null && !Number.isNaN(actual) ? expectedBalance(account, entries ?? [], date) : null
  const diff = check && actual !== null ? Math.round((actual - check.expected) * 100) / 100 : 0
  const mismatch = check !== null && Math.abs(diff) >= TOLERANCE
  const fixValue = fixAmount.trim() === '' ? Math.abs(diff) : Number(fixAmount.replace(',', '.'))

  async function addAdjustment(name: string, icon: string, kind: EntryKind) {
    if (!(fixValue > 0)) return setError('Enter an amount')
    setBusy(true)
    setError(null)
    try {
      const cat = await ensureCategory(categories, name, kind, icon)
      await addEntry(dc, {
        kind,
        amount: Math.round(fixValue * 100) / 100,
        date,
        note: `${account.name} balance`,
        categoryId: cat.id,
        paymentMethodId: account.id,
        paidCardId: null,
      })
      if (cat.created) await refreshHome()
      dataChanged()
      setAdded((a) => [...a, `${name} ${money(fixValue, currency)}`])
      setFixAmount('')
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    if (actual === null || Number.isNaN(actual)) return setError('Enter the balance')
    if (account.lastStatementDate && date < account.lastStatementDate)
      return setError(`Date can't be before the last balance (${shortDate(account.lastStatementDate)})`)
    if (mismatch && !confirm(`The app is still ${money(Math.abs(diff), currency)} off. Save the balance anyway?`))
      return
    setBusy(true)
    setError(null)
    try {
      await updatePaymentMethod(dc, {
        id: account.id,
        name: account.name,
        type: account.type,
        creditLimit: null,
        lastStatementBalance: actual,
        lastStatementDate: date,
        paymentDueDate: null,
      })
      await refreshHome()
      dataChanged()
      onClose()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <form className="sheet" onSubmit={save} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>Update balance · {account.name}</h2>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="row">
          <label className="grow">
            Date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </label>
          <label className="grow">
            Actual balance
            <input
              inputMode="decimal"
              value={balance}
              onChange={(e) => setBalance(e.target.value.replace(/[^\d.,-]/g, ''))}
              placeholder="From bank / app"
              autoFocus
            />
          </label>
        </div>

        {check && (
          <div className="card-inset stack recon">
            <div className="recon-row">
              <span>Balance on {shortDate(account.lastStatementDate)}</span>
              <span>{money(check.previous, currency)}</span>
            </div>
            <div className="recon-row">
              <span>+ Money in recorded</span>
              <span>{money(check.moneyIn, currency)}</span>
            </div>
            <div className="recon-row">
              <span>− Money out recorded</span>
              <span>{money(check.moneyOut, currency)}</span>
            </div>
            <div className="recon-row total">
              <span>App expects</span>
              <span>{money(check.expected, currency)}</span>
            </div>
            <div className="recon-row total">
              <span>Actual balance</span>
              <span>{money(actual ?? 0, currency)}</span>
            </div>

            {!mismatch ? (
              <p className="ok">✓ The app matches your balance.</p>
            ) : (
              <>
                <p className={diff > 0 ? 'warn' : 'error'}>
                  {diff > 0
                    ? `The account has ${money(diff, currency)} more than the app. Usually interest or income that wasn't recorded.`
                    : `The account has ${money(-diff, currency)} less than the app. Usually bank charges or a payment that wasn't recorded.`}
                </p>
                <label>
                  Amount
                  <input
                    inputMode="decimal"
                    value={fixAmount}
                    onChange={(e) => setFixAmount(e.target.value.replace(/[^\d.,]/g, ''))}
                    placeholder={Math.abs(diff).toFixed(2)}
                  />
                </label>
                <div className="chips">
                  {(diff > 0 ? MORE_IN_BANK : LESS_IN_BANK).map((c) => (
                    <button
                      type="button"
                      key={c.name}
                      className="chip"
                      disabled={busy}
                      onClick={() => addAdjustment(c.name, c.icon, c.kind)}
                    >
                      + {c.icon} Add as {c.name}
                    </button>
                  ))}
                </div>
              </>
            )}
            {added.length > 0 && <p className="muted small">Added: {added.join(', ')}</p>}
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <button className="btn primary" disabled={busy}>
          Save balance
        </button>
      </form>
    </div>
  )
}
