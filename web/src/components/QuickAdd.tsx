import { useMemo, useState, type FormEvent } from 'react'
import { addEntry, deleteEntry, updateEntry } from '@pocketbook/dataconnect'
import { dc } from '../firebase'
import { errorMessage, isoDate } from '../lib/format'
import { CC_PAYMENT, paymentIcon, type Entry, type EntryKind } from '../lib/types'
import { useApp, useHousehold } from '../state/AppContext'
import { useBusy } from '../state/busy'

const LAST_METHOD_KEY = 'pocketbook.lastMethod'

function rememberedMethod(): string | null {
  try {
    return localStorage.getItem(LAST_METHOD_KEY)
  } catch {
    return null
  }
}

/** Rendered only while open; remounted each time so the form starts fresh. */
export default function QuickAdd({ entry: editing }: { entry?: Entry }) {
  const { closeQuickAdd, dataChanged } = useApp()
  const household = useHousehold()

  const [kind, setKind] = useState<EntryKind>((editing?.kind as EntryKind) ?? 'EXPENSE')
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '')
  const [categoryId, setCategoryId] = useState<string | null>(editing?.category?.id ?? null)
  const [methodId, setMethodId] = useState<string | null>(() => {
    if (editing) return editing.paymentMethod?.id ?? null
    const remembered = rememberedMethod()
    return (household.paymentMethods.find((m) => m.id === remembered) ?? household.paymentMethods[0])?.id ?? null
  })
  const [paidCardId, setPaidCardId] = useState<string | null>(editing?.paidCard?.id ?? null)
  const [date, setDate] = useState(editing?.date ?? isoDate())
  const [note, setNote] = useState(editing?.note ?? '')
  const [busy, setBusy] = useBusy()
  const [error, setError] = useState<string | null>(null)

  const categories = useMemo(() => household.categories.filter((c) => c.kind === kind), [household.categories, kind])
  const category = household.categories.find((c) => c.id === categoryId)
  const isCardPayment = kind === 'EXPENSE' && category?.systemKey === CC_PAYMENT
  const cards = household.paymentMethods.filter((m) => m.type === 'CREDIT_CARD')
  // You can't pay a card off with that same card.
  const methods = isCardPayment
    ? household.paymentMethods.filter((m) => m.type !== 'CREDIT_CARD')
    : household.paymentMethods

  function switchKind(k: EntryKind) {
    setKind(k)
    setCategoryId(null)
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    const value = Number(amount.replace(',', '.'))
    if (!(value > 0)) return setError('Enter an amount')
    if (!categoryId) return setError('Pick a category')
    if (isCardPayment && !paidCardId) return setError('Which card are you paying?')
    setBusy(true)
    setError(null)
    const vars = {
      kind,
      amount: Math.round(value * 100) / 100,
      date,
      note: note.trim() || null,
      categoryId,
      paymentMethodId: methodId,
      paidCardId: isCardPayment ? paidCardId : null,
    }
    try {
      if (editing) await updateEntry(dc, { id: editing.id, ...vars })
      else await addEntry(dc, vars)
      try {
        if (methodId) localStorage.setItem(LAST_METHOD_KEY, methodId)
      } catch {
        /* storage unavailable */
      }
      dataChanged()
      closeQuickAdd()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!editing || !confirm('Delete this entry?')) return
    setBusy(true)
    try {
      await deleteEntry(dc, { id: editing.id })
      dataChanged()
      closeQuickAdd()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="sheet-backdrop" onClick={closeQuickAdd}>
      <form className={`sheet ${kind.toLowerCase()}`} onSubmit={save} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <div className="segmented">
            <button type="button" className={kind === 'EXPENSE' ? 'on' : ''} onClick={() => switchKind('EXPENSE')}>
              Expense
            </button>
            <button type="button" className={kind === 'INCOME' ? 'on' : ''} onClick={() => switchKind('INCOME')}>
              Income
            </button>
          </div>
          <button type="button" className="icon-btn" aria-label="Close" onClick={closeQuickAdd}>
            ✕
          </button>
        </div>

        <div className="amount-row">
          <span className="currency">{household.currency}</span>
          <input
            autoFocus
            className="amount-input"
            inputMode="decimal"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ''))}
            aria-label="Amount"
          />
        </div>

        <div className="field-label">Category</div>
        <div className="chips">
          {categories.map((c) => (
            <button
              type="button"
              key={c.id}
              className={`chip ${c.id === categoryId ? 'on' : ''}`}
              onClick={() => setCategoryId(c.id)}
            >
              <span>{c.icon}</span> {c.name}
            </button>
          ))}
        </div>

        {isCardPayment && (
          <>
            <div className="field-label">Card being paid</div>
            <div className="chips">
              {cards.length === 0 && <span className="muted small">Add a credit card on the Cards tab first.</span>}
              {cards.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  className={`chip ${c.id === paidCardId ? 'on' : ''}`}
                  onClick={() => setPaidCardId(c.id)}
                >
                  💳 {c.name}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="field-label">{kind === 'INCOME' ? 'Received into' : 'Paid with'}</div>
        <div className="chips">
          {methods.map((m) => (
            <button
              type="button"
              key={m.id}
              className={`chip ${m.id === methodId ? 'on' : ''}`}
              onClick={() => setMethodId(m.id)}
            >
              {paymentIcon(m.type)} {m.name}
            </button>
          ))}
        </div>

        <div className="row">
          <label className="grow">
            Date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </label>
          <label className="grow2">
            Note
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" maxLength={200} />
          </label>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="row">
          {editing && (
            <button type="button" className="btn danger" onClick={remove} disabled={busy}>
              Delete
            </button>
          )}
          <button className="btn primary grow" disabled={busy}>
            {editing ? 'Save changes' : kind === 'INCOME' ? 'Add income' : 'Add expense'}
          </button>
        </div>
      </form>
    </div>
  )
}
