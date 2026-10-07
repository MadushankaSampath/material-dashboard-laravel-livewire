import { useState, type FormEvent } from 'react'
import { addPaymentMethod, archivePaymentMethod, updatePaymentMethod } from '@pocketbook/dataconnect'
import AccountBalanceSheet from '../components/AccountBalanceSheet'
import CardTile from '../components/CardTile'
import InstallmentPlans from '../components/InstallmentPlans'
import StatementSheet from '../components/StatementSheet'
import { dc } from '../firebase'
import { accountStatus, accountsSince, canTrackBalance, tracksBalance, type AccountStatus } from '../lib/accounts'
import { activitySince, cardStatuses } from '../lib/cards'
import { errorMessage, isoDate, money, shortDate } from '../lib/format'
import { PAYMENT_TYPES, paymentIcon, type PaymentMethod } from '../lib/types'
import { useApp, useHousehold } from '../state/AppContext'
import { useCardActivity, useEntries } from '../state/useEntries'
import { useBusy } from '../state/busy'

type Editing = PaymentMethod | 'new' | null

export default function CardsPage() {
  const household = useHousehold()
  const [editing, setEditing] = useState<Editing>(null)
  const [statementFor, setStatementFor] = useState<PaymentMethod | null>(null)
  const cards = household.paymentMethods.filter((m) => m.type === 'CREDIT_CARD')
  const others = household.paymentMethods.filter((m) => m.type !== 'CREDIT_CARD')
  const tracked = others.filter(tracksBalance)
  const untracked = others.filter((m) => !tracksBalance(m))
  const [balanceFor, setBalanceFor] = useState<PaymentMethod | null>(null)
  // Entries since the oldest known account balance, to work out current balances.
  const { entries: accountEntries } = useEntries(accountsSince(tracked), isoDate(), tracked.length > 0, 5000)
  const accounts = tracked.map((a) => accountStatus(a, accountEntries ?? []))
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0)
  const activity = useCardActivity(activitySince(cards), cards.length > 0)
  const statuses = cardStatuses(cards, activity)

  const totalLimit = statuses.reduce((s, c) => s + c.limit, 0)
  const totalAvailable = statuses.reduce((s, c) => s + c.available, 0)

  return (
    <div className="page stack">
      <div className="section-head">
        <h1>Accounts &amp; cards</h1>
        <button className="btn small primary" onClick={() => setEditing('new')}>
          + Add
        </button>
      </div>

      {cards.length > 0 && <h2>Credit cards</h2>}
      {cards.length > 0 && (
        <p className="muted">
          {new Intl.NumberFormat().format(Math.round(totalAvailable))} of{' '}
          {new Intl.NumberFormat().format(Math.round(totalLimit))} {household.currency} credit available
        </p>
      )}

      <div className="cc-grid">
        {statuses.map((s) => (
          <div key={s.card.id} className="cc-wrap">
            <CardTile status={s} currency={household.currency} onClick={() => setEditing(s.card)} />
            <button className="btn small" onClick={() => setStatementFor(s.card)}>
              📄 Enter new statement
            </button>
          </div>
        ))}
      </div>

      <section className="stack">
        <div className="section-head">
          <h2>Bank accounts &amp; cash</h2>
          {accounts.length > 0 && <span className="muted small">{money(totalBalance, household.currency)} total</span>}
        </div>
        <div className="cc-grid">
          {accounts.map((a) => (
            <div key={a.account.id} className="cc-wrap">
              <AccountTile status={a} currency={household.currency} onClick={() => setEditing(a.account)} />
              <button className="btn small" onClick={() => setBalanceFor(a.account)}>
                🔄 Update balance
              </button>
            </div>
          ))}
        </div>
        {untracked.length > 0 && (
          <div className="card">
            <ul className="list">
              {untracked.map((m) => (
                <li key={m.id}>
                  <button className="list-btn" onClick={() => setEditing(m)}>
                    <span>
                      {paymentIcon(m.type)} {m.name}
                    </span>
                    <span className="muted small">
                      {canTrackBalance(m) ? 'Tap to add balance' : PAYMENT_TYPES.find((t) => t.value === m.type)?.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <p className="muted small">
        Account balance = last known balance + money received into it − money paid from it since then. Card balance =
        last statement balance + purchases since the statement date − payments and refunds since.
        Available = limit − balance − amounts blocked by instalment plans. Enter each month&apos;s statement to keep it
        accurate — the app compares it with what you recorded and helps you add any interest or bank charges.
      </p>

      {balanceFor && (
        <AccountBalanceSheet account={balanceFor} entries={accountEntries} onClose={() => setBalanceFor(null)} />
      )}
      {statementFor && <StatementSheet card={statementFor} onClose={() => setStatementFor(null)} />}
      {editing && <MethodForm method={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} />}
    </div>
  )
}

function AccountTile({ status, currency, onClick }: { status: AccountStatus; currency: string; onClick: () => void }) {
  const { account, balance, asOf, moneyIn, moneyOut } = status
  return (
    <button type="button" className="cc account" onClick={onClick}>
      <div className="cc-top">
        <span className="cc-name">
          {paymentIcon(account.type)} {account.name}
        </span>
      </div>
      <div className="cc-available">{money(balance, currency)}</div>
      <div className="cc-label">balance</div>
      <div className="cc-foot">
        <span>Since {shortDate(asOf)}</span>
        <span>
          +{money(moneyIn, currency)} / −{money(moneyOut, currency)}
        </span>
      </div>
    </button>
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
  const [busy, setBusy] = useBusy()
  const [error, setError] = useState<string | null>(null)
  const isCard = type === 'CREDIT_CARD'
  const hasBalance = canTrackBalance({ type } as PaymentMethod)
  const [balance, setBalance] = useState(
    method && method.type !== 'CREDIT_CARD' ? (method.lastStatementBalance?.toString() ?? '') : '',
  )
  const [balanceDate, setBalanceDate] = useState(
    (method && method.type !== 'CREDIT_CARD' ? method.lastStatementDate : null) ?? isoDate(),
  )

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
      lastStatementBalance: isCard ? num(stmtBalance) : hasBalance ? num(balance) : null,
      lastStatementDate: isCard ? stmtDate || null : hasBalance && num(balance) !== null ? balanceDate : null,
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
          <h2>{method ? 'Edit' : 'Add'} card or account</h2>
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
            {method?.type === 'CREDIT_CARD' && <InstallmentPlans cardId={method.id} />}
          </>
        )}
        {hasBalance && (
          <>
            <div className="row">
              <label className="grow">
                Current balance
                <input
                  inputMode="decimal"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="Optional"
                />
              </label>
              <label className="grow">
                Balance on
                <input type="date" value={balanceDate} onChange={(e) => setBalanceDate(e.target.value)} />
              </label>
            </div>
            <p className="muted small">
              Add a balance to track this account. Money received into it and paid from it after this date updates the
              balance automatically.
            </p>
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
