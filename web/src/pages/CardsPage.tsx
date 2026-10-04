import { useState, type FormEvent } from 'react'
import { addPaymentMethod, archivePaymentMethod, updatePaymentMethod } from '@pocketbook/dataconnect'
import CardTile from '../components/CardTile'
import { dc } from '../firebase'
import { activitySince, cardStatuses } from '../lib/cards'
import { errorMessage } from '../lib/format'
import { PAYMENT_TYPES, paymentIcon, type PaymentMethod } from '../lib/types'
import { useApp, useHousehold } from '../state/AppContext'
import { useCardActivity } from '../state/useEntries'

type Editing = PaymentMethod | 'new' | null

export default function CardsPage() {
  const household = useHousehold()
  const [editing, setEditing] = useState<Editing>(null)
  const cards = household.paymentMethods.filter((m) => m.type === 'CREDIT_CARD')
  const others = household.paymentMethods.filter((m) => m.type !== 'CREDIT_CARD')
  const activity = useCardActivity(activitySince(cards), cards.length > 0)
  const statuses = cardStatuses(cards, activity)

  const totalLimit = statuses.reduce((s, c) => s + c.limit, 0)
  const totalAvailable = statuses.reduce((s, c) => s + c.available, 0)

  return (
    <div className="page stack">
      <div className="section-head">
        <h1>Cards &amp; accounts</h1>
        <button className="btn small primary" onClick={() => setEditing('new')}>
          + Add
        </button>
      </div>

      {cards.length > 0 && (
        <p className="muted">
          {new Intl.NumberFormat().format(Math.round(totalAvailable))} of{' '}
          {new Intl.NumberFormat().format(Math.round(totalLimit))} {household.currency} credit available
        </p>
      )}

      <div className="cc-grid">
        {statuses.map((s) => (
          <CardTile key={s.card.id} status={s} currency={household.currency} onClick={() => setEditing(s.card)} />
        ))}
      </div>

      <section className="card">
        <h2>Other payment types</h2>
        <ul className="list">
          {others.map((m) => (
            <li key={m.id}>
              <button className="list-btn" onClick={() => setEditing(m)}>
                <span>
                  {paymentIcon(m.type)} {m.name}
                </span>
                <span className="muted small">{PAYMENT_TYPES.find((t) => t.value === m.type)?.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <p className="muted small">
        Card balance = last statement balance + purchases since the statement date − payments and refunds since. Update
        the statement each month to keep it accurate.
      </p>

      {editing && <MethodForm method={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} />}
    </div>
  )
}

function MethodForm({ method, onClose }: { method?: PaymentMethod; onClose: () => void }) {
  const { refreshHome, dataChanged } = useApp()
  const { paymentMethods } = useHousehold()
  const [name, setName] = useState(method?.name ?? '')
  const [type, setType] = useState(method?.type ?? 'CREDIT_CARD')
  const [limit, setLimit] = useState(method?.creditLimit?.toString() ?? '')
  const [stmtBalance, setStmtBalance] = useState(method?.lastStatementBalance?.toString() ?? '')
  const [stmtDate, setStmtDate] = useState(method?.lastStatementDate ?? '')
  const [dueDate, setDueDate] = useState(method?.paymentDueDate ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isCard = type === 'CREDIT_CARD'

  const num = (s: string) => (s.trim() === '' ? null : Number(s))

  async function run(fn: () => Promise<unknown>) {
    setBusy(true)
    setError(null)
    try {
      await fn()
      await refreshHome()
      dataChanged()
      onClose()
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  function save(e: FormEvent) {
    e.preventDefault()
    const vars = {
      name: name.trim(),
      type,
      creditLimit: isCard ? num(limit) : null,
      lastStatementBalance: isCard ? num(stmtBalance) : null,
      lastStatementDate: isCard && stmtDate ? stmtDate : null,
      paymentDueDate: isCard && dueDate ? dueDate : null,
    }
    void run(() =>
      method
        ? updatePaymentMethod(dc, { id: method.id, ...vars })
        : addPaymentMethod(dc, { ...vars, sortOrder: paymentMethods.length }),
    )
  }

  function archive() {
    if (!method || !confirm(`Remove ${method.name}? Past entries keep it.`)) return
    void run(() => archivePaymentMethod(dc, { id: method.id }))
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <form className="sheet" onSubmit={save} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>{method ? 'Edit' : 'Add'} payment type</h2>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="chips">
          {PAYMENT_TYPES.map((t) => (
            <button type="button" key={t.value} className={`chip ${type === t.value ? 'on' : ''}`} onClick={() => setType(t.value)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <label>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={60}
            placeholder={isCard ? 'e.g. HNB Visa' : 'e.g. Savings account'}
          />
        </label>
        {isCard && (
          <>
            <div className="row">
              <label className="grow">
                Credit limit
                <input inputMode="decimal" value={limit} onChange={(e) => setLimit(e.target.value)} required />
              </label>
              <label className="grow">
                Last statement balance
                <input inputMode="decimal" value={stmtBalance} onChange={(e) => setStmtBalance(e.target.value)} />
              </label>
            </div>
            <div className="row">
              <label className="grow">
                Statement date
                <input type="date" value={stmtDate} onChange={(e) => setStmtDate(e.target.value)} />
              </label>
              <label className="grow">
                Payment due
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </label>
            </div>
          </>
        )}
        {error && <p className="error">{error}</p>}
        <div className="row">
          {method && (
            <button type="button" className="btn danger" onClick={archive} disabled={busy}>
              Remove
            </button>
          )}
          <button className="btn primary grow" disabled={busy}>
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
