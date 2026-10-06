import { useState } from 'react'
import { addInstallmentPlan, deleteInstallmentPlan } from '@pocketbook/dataconnect'
import { dc } from '../firebase'
import { planStatus } from '../lib/cards'
import { errorMessage, isoDate, money, shortDate } from '../lib/format'
import { useApp, useHousehold } from '../state/AppContext'

/**
 * Instalment plans on one card. Rendered inside the card's edit sheet, which is
 * itself a <form>, so this uses plain buttons rather than a nested form.
 */
export default function InstallmentPlans({ cardId }: { cardId: string }) {
  const { refreshHome, dataChanged } = useApp()
  const { paymentMethods, currency } = useHousehold()
  const card = paymentMethods.find((m) => m.id === cardId)
  const [adding, setAdding] = useState(false)
  const [description, setDescription] = useState('')
  const [total, setTotal] = useState('')
  const [months, setMonths] = useState('12')
  const [startDate, setStartDate] = useState(isoDate())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!card) return null
  const plans = card.installmentPlans.map((p) => planStatus(p, card.lastStatementDate))
  const active = plans.filter((p) => p.remaining > 0)
  const finished = plans.filter((p) => p.remaining <= 0)

  async function run(fn: () => Promise<unknown>) {
    setBusy(true)
    setError(null)
    try {
      await fn()
      await refreshHome()
      dataChanged()
      return true
    } catch (e) {
      setError(errorMessage(e))
      return false
    } finally {
      setBusy(false)
    }
  }

  async function add() {
    const amount = Number(total.replace(',', '.'))
    const n = Number(months)
    if (!description.trim()) return setError('What was bought?')
    if (!(amount > 0)) return setError('Enter the total amount')
    if (!(n >= 1 && n <= 120 && Number.isInteger(n))) return setError('Months must be 1–120')
    const ok = await run(() =>
      addInstallmentPlan(dc, { cardId, description: description.trim(), totalAmount: amount, months: n, startDate }),
    )
    if (ok) {
      setAdding(false)
      setDescription('')
      setTotal('')
    }
  }

  function remove(id: string, name: string) {
    if (confirm(`Remove instalment plan "${name}"?`)) void run(() => deleteInstallmentPlan(dc, { id }))
  }

  return (
    <div className="stack plans">
      <div className="section-head">
        <div className="field-label">Instalment plans (blocked amount)</div>
        {!adding && (
          <button type="button" className="btn small" onClick={() => setAdding(true)}>
            + Plan
          </button>
        )}
      </div>

      {plans.length === 0 && !adding && (
        <p className="muted small">
          Bought something on 0% instalments? Add it here so its unbilled amount is held against this card&apos;s
          limit.
        </p>
      )}

      {[...active, ...finished].map(({ plan, monthly, billed, remaining }) => (
        <div key={plan.id} className={`plan ${remaining <= 0 ? 'done' : ''}`}>
          <div className="grow">
            <strong>{plan.description}</strong>
            <span className="muted small block">
              {money(monthly, currency)} × {plan.months} from {shortDate(plan.startDate)} · {billed}/{plan.months} billed
            </span>
          </div>
          <div className="plan-amount">
            {remaining > 0 ? (
              <>
                <strong>{money(remaining, currency)}</strong>
                <span className="muted small block">blocked</span>
              </>
            ) : (
              <span className="muted small">Paid off</span>
            )}
          </div>
          <button
            type="button"
            className="icon-btn"
            aria-label={`Remove ${plan.description}`}
            disabled={busy}
            onClick={() => remove(plan.id, plan.description)}
          >
            ✕
          </button>
        </div>
      ))}

      {adding && (
        <div className="card-inset stack">
          <label>
            Item / description
            <input value={description} onChange={(e) => setDescription(e.target.value)} maxLength={80} placeholder="e.g. Fridge – Abans" />
          </label>
          <div className="row">
            <label className="grow">
              Total amount
              <input inputMode="decimal" value={total} onChange={(e) => setTotal(e.target.value)} />
            </label>
            <label className="grow">
              Months
              <input inputMode="numeric" value={months} onChange={(e) => setMonths(e.target.value.replace(/\D/g, ''))} />
            </label>
          </div>
          <label>
            Purchase date
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          {Number(total) > 0 && Number(months) > 0 && (
            <p className="muted small">
              {money(Number(total) / Number(months), currency)} per month, billed on each statement after the purchase.
            </p>
          )}
          <div className="row">
            <button type="button" className="btn" onClick={() => setAdding(false)} disabled={busy}>
              Cancel
            </button>
            <button type="button" className="btn primary grow" onClick={add} disabled={busy}>
              Add plan
            </button>
          </div>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  )
}
