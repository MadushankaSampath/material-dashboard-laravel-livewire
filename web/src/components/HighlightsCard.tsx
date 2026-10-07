import { amount, dayLabel, money } from '../lib/format'
import type { Highlights } from '../lib/highlights'
import { useApp } from '../state/AppContext'

export default function HighlightsCard({ h, currency, showMembers }: { h: Highlights; currency: string; showMembers: boolean }) {
  const { authUser, openQuickAdd } = useApp()
  if (h.spent === 0) return null
  const pct = h.change === null ? null : Math.round(h.change * 100)

  return (
    <section className="card stack">
      <h2>Expense highlights</h2>

      <div className="hl-grid">
        <div className="hl">
          <span className="muted small">This week</span>
          <strong>{amount(h.thisWeek)}</strong>
        </div>
        <div className="hl">
          <span className="muted small">Daily average</span>
          <strong>{amount(h.dailyAverage)}</strong>
        </div>
        <div className="hl">
          <span className="muted small">vs last month</span>
          {pct === null ? (
            <strong className="muted">—</strong>
          ) : (
            <strong className={pct > 0 ? 'neg' : 'pos'}>
              {pct > 0 ? '▲' : pct < 0 ? '▼' : ''} {Math.abs(pct)}%
            </strong>
          )}
          <span className="muted tiny">
            {pct === null ? 'no data last month' : `${amount(h.lastMonthSoFar)} by this day`}
          </span>
        </div>
        <div className="hl">
          <span className="muted small">On track for</span>
          <strong>{amount(h.projected)}</strong>
          <span className="muted tiny">this month</span>
        </div>
      </div>

      {h.biggest && (
        <button className="hl-row" onClick={() => openQuickAdd(h.biggest!)}>
          <span className="entry-icon">{h.biggest.category?.icon ?? '•'}</span>
          <span className="grow">
            <span className="muted small block">Biggest expense</span>
            {h.biggest.category?.name ?? 'Uncategorised'}
            {h.biggest.note && ` · ${h.biggest.note}`}
            <span className="muted small"> · {dayLabel(h.biggest.date)}</span>
          </span>
          <strong>{money(h.biggest.amount, currency)}</strong>
        </button>
      )}

      {h.topCategory && (
        <p className="hl-note">
          {h.topCategory.icon} <strong>{h.topCategory.name}</strong> is {Math.round(h.topCategory.share * 100)}% of
          spending this month.
        </p>
      )}

      {showMembers && h.byMember.length > 0 && (
        <div className="stack hl-members">
          <span className="muted small">Who spent</span>
          {h.byMember.map((m) => (
            <div key={m.id} className="hl-member">
              <span>{m.id === authUser?.uid ? 'You' : m.name}</span>
              <span>{money(m.total, currency)}</span>
              <i style={{ width: `${(m.total / h.spent) * 100}%` }} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
