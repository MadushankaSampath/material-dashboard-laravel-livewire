import { useState, type FormEvent } from 'react'
import { addEntry, updatePaymentMethod } from '@pocketbook/dataconnect'
import { dc } from '../firebase'
import { expectedStatement } from '../lib/cards'
import { ensureCategory } from '../lib/categories'
import { errorMessage, isoDate, money, shortDate } from '../lib/format'
import type { EntryKind, PaymentMethod } from '../lib/types'
import { useApp, useHousehold } from '../state/AppContext'
import { useCardActivity } from '../state/useEntries'
import { useBusy } from '../state/busy'

/** Categories offered for closing the gap; created on first use if the household lacks them. */
const EXTRA_CHARGES = [
  { name: 'Interest', icon: '💸' },
  { name: 'Bank Charges', icon: '🏦' },
  { name: 'Other', icon: '📦' },
]
const CREDITS = [{ name: 'Cashback', icon: '🎉' }]

/** Differences smaller than this are rounding, not a mismatch. */
const TOLERANCE = 0.5

/**
 * Enter a new monthly statement for a credit card. Compares the bank's balance
 * with what the app expects and helps record the difference (interest, bank
 * charges, cashback) so the two match before saving.
 */
export default function StatementSheet({ card, onClose }: { card: PaymentMethod; onClose: () => void }) {
  const { refreshHome, dataChanged } = useApp()
  const { categories, currency } = useHousehold()
  const [date, setDate] = useState(isoDate())
  const [balance, setBalance] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [fixAmount, setFixAmount] = useState('')
  const [busy, setBusy] = useBusy()
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState<string[]>([])

  const activity = useCardActivity(card.lastStatementDate ?? '1970-01-01', true)
  const bank = balance.trim() === '' ? null : Number(balance.replace(',', '.'))
  const check = bank !== null && !Number.isNaN(bank) ? expectedStatement(card, activity, date) : null
  const diff = check && bank !== null ? Math.round((bank - check.expected) * 100) / 100 : 0
  const mismatch = check !== null && Math.abs(diff) >= TOLERANCE
  const fixValue = fixAmount.trim() === '' ? Math.abs(diff) : Number(fixAmount.replace(',', '.'))

  async function addAdjustment(name: string, icon: string) {
    if (!(fixValue > 0)) return setError('Enter an amount')
    const kind: EntryKind = diff > 0 ? 'EXPENSE' : 'INCOME'
    setBusy(true)
    setError(null)
    try {
      const cat = await ensureCategory(categories, name, kind, icon)
      await addEntry(dc, {
        kind,
        amount: Math.round(fixValue * 100) / 100,
        date,
        note: `${card.name} statement`,
        categoryId: cat.id,
        // On the card: an expense raises its balance, income (cashback) lowers it.
        paymentMethodId: card.id,
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
    if (bank === null || Number.isNaN(bank)) return setError('Enter the statement balance')
    if (card.lastStatementDate && date <= card.lastStatementDate)
      return setError(`Statement date must be after the last one (${shortDate(card.lastStatementDate)})`)
    if (mismatch && !confirm(`The app is still ${money(Math.abs(diff), currency)} off. Save the statement anyway?`))
      return
    setBusy(true)
    setError(null)
    try {
      await updatePaymentMethod(dc, {
        id: card.id,
        name: card.name,
        type: card.type,
        creditLimit: card.creditLimit ?? null,
        lastStatementBalance: bank,
        lastStatementDate: date,
        paymentDueDate: dueDate || card.paymentDueDate || null,
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
          <h2>New statement · {card.name}</h2>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="row">
          <label className="grow">
            Statement date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </label>
          <label className="grow">
            Statement balance
            <input
              inputMode="decimal"
              value={balance}
              onChange={(e) => setBalance(e.target.value.replace(/[^\d.,-]/g, ''))}
              placeholder="From the bank"
              autoFocus
            />
          </label>
        </div>
        <label>
          Payment due date
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>

        {!card.lastStatementDate && (
          <p className="muted small">This is the first statement for this card, so there is nothing to compare yet.</p>
        )}

        {check && (
          <div className="card-inset stack recon">
            <div className="recon-row">
              <span>Previous statement ({shortDate(card.lastStatementDate)})</span>
              <span>{money(check.previous, currency)}</span>
            </div>
            <div className="recon-row">
              <span>+ Purchases recorded</span>
              <span>{money(check.purchases, currency)}</span>
            </div>
            {check.instalments > 0 && (
              <div className="recon-row">
                <span>+ Instalments billed</span>
                <span>{money(check.instalments, currency)}</span>
              </div>
            )}
            <div className="recon-row">
              <span>− Payments &amp; refunds recorded</span>
              <span>{money(check.paymentsAndRefunds, currency)}</span>
            </div>
            <div className="recon-row total">
              <span>App expects</span>
              <span>{money(check.expected, currency)}</span>
            </div>
            <div className="recon-row total">
              <span>Bank statement</span>
              <span>{money(bank ?? 0, currency)}</span>
            </div>

            {!mismatch ? (
              <p className="ok">✓ The app matches the bank statement.</p>
            ) : (
              <>
                <p className={diff > 0 ? 'error' : 'warn'}>
                  {diff > 0
                    ? `The bank shows ${money(diff, currency)} more than the app. This is usually interest or bank charges — add it as an expense so they match.`
                    : `The bank shows ${money(-diff, currency)} less than the app. This could be cashback, a refund, or a payment that wasn't recorded.`}
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
                  {(diff > 0 ? EXTRA_CHARGES : CREDITS).map((c) => (
                    <button
                      type="button"
                      key={c.name}
                      className="chip"
                      disabled={busy}
                      onClick={() => addAdjustment(c.name, c.icon)}
                    >
                      + {c.icon} Add as {c.name}
                    </button>
                  ))}
                </div>
                {diff < 0 && (
                  <p className="muted small">
                    Missed a payment? Close this, add it with + as a “CC Payment”, then enter the statement again.
                  </p>
                )}
              </>
            )}
            {added.length > 0 && <p className="muted small">Added: {added.join(', ')}</p>}
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <button className="btn primary" disabled={busy}>
          Save statement
        </button>
      </form>
    </div>
  )
}
