import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import CardTile from '../components/CardTile'
import EntryList from '../components/EntryList'
import { activitySince, cardStatuses } from '../lib/cards'
import { amount, isoDate, money, monthLabel, monthRange } from '../lib/format'
import { summarise } from '../lib/summary'
import { useApp, useHousehold } from '../state/AppContext'
import { useCardActivity, useEntries } from '../state/useEntries'

export default function HomePage() {
  const { home } = useApp()
  const household = useHousehold()
  const { currency } = household
  const now = new Date()
  const { from, to } = monthRange(now.getFullYear(), now.getMonth())
  const { entries, error } = useEntries(from, to)

  const cards = household.paymentMethods.filter((m) => m.type === 'CREDIT_CARD')
  const activity = useCardActivity(activitySince(cards), cards.length > 0)
  const statuses = cardStatuses(cards, activity)

  const summary = useMemo(() => summarise(entries ?? []), [entries])
  const today = isoDate()
  const spentToday = summarise((entries ?? []).filter((e) => e.date === today)).spent
  const firstName = home?.user?.displayName.split(' ')[0]

  return (
    <div className="page stack">
      <header className="greeting">
        <div>
          <p className="muted small">{household.name}</p>
          <h1>Hi {firstName} 👋</h1>
        </div>
        <div className="today">
          <span className="muted small">Spent today</span>
          <strong>{money(spentToday, currency)}</strong>
        </div>
      </header>

      <section className="card summary">
        <div className="muted small">
          {monthLabel(now.getFullYear(), now.getMonth())} · {currency}
        </div>
        <div className="summary-grid">
          <div>
            <span className="muted small">Income</span>
            <strong className="pos">{amount(summary.income)}</strong>
          </div>
          <div>
            <span className="muted small">Spent</span>
            <strong className="neg">{amount(summary.spent)}</strong>
          </div>
          <div>
            <span className="muted small">Left</span>
            <strong>{amount(summary.income - summary.spent)}</strong>
          </div>
        </div>
        {summary.cardPayments > 0 && (
          <p className="muted small">+ {money(summary.cardPayments, currency)} paid to credit cards</p>
        )}
      </section>

      {statuses.length > 0 && (
        <section>
          <div className="section-head">
            <h2>Credit cards</h2>
            <Link to="/cards">Manage</Link>
          </div>
          <div className="cc-strip">
            {statuses.map((s) => (
              <CardTile key={s.card.id} status={s} currency={currency} />
            ))}
          </div>
        </section>
      )}

      {summary.byCategory.length > 0 && (
        <section className="card">
          <h2>Where it went</h2>
          <ul className="bars">
            {summary.byCategory.slice(0, 6).map((c) => (
              <li key={c.name}>
                <span>
                  {c.icon} {c.name}
                </span>
                <span>{money(c.total, currency)}</span>
                <i style={{ width: `${(c.total / summary.byCategory[0].total) * 100}%` }} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className="section-head">
          <h2>Recent</h2>
          <Link to="/history">See all</Link>
        </div>
        {error && <p className="error">{error}</p>}
        {entries ? (
          <EntryList entries={entries.slice(0, 15)} empty="No entries this month. Tap + to add one." />
        ) : (
          <p className="muted center pad">Loading…</p>
        )}
      </section>
    </div>
  )
}
