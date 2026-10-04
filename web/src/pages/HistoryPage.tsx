import { useMemo, useState } from 'react'
import EntryList from '../components/EntryList'
import { amount, monthLabel, monthRange } from '../lib/format'
import { summarise } from '../lib/summary'
import { useHousehold } from '../state/AppContext'
import { useEntries } from '../state/useEntries'

type Filter = 'ALL' | 'EXPENSE' | 'INCOME'

export default function HistoryPage() {
  const { currency, paymentMethods } = useHousehold()
  const now = new Date()
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [filter, setFilter] = useState<Filter>('ALL')
  const [methodId, setMethodId] = useState('')
  const [search, setSearch] = useState('')
  const { from, to } = monthRange(ym.y, ym.m)
  const { entries, error } = useEntries(from, to)

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (entries ?? []).filter(
      (e) =>
        (filter === 'ALL' || e.kind === filter) &&
        (!methodId || e.paymentMethod?.id === methodId || e.paidCard?.id === methodId) &&
        (!q || `${e.category?.name ?? ''} ${e.note ?? ''}`.toLowerCase().includes(q)),
    )
  }, [entries, filter, methodId, search])
  const s = summarise(shown)

  const step = (d: number) => setYm(({ y, m }) => ({ y: m + d < 0 ? y - 1 : m + d > 11 ? y + 1 : y, m: (m + d + 12) % 12 }))
  const isCurrent = ym.y === now.getFullYear() && ym.m === now.getMonth()

  return (
    <div className="page stack">
      <header className="month-nav">
        <button className="icon-btn" onClick={() => step(-1)} aria-label="Previous month">
          ‹
        </button>
        <h1>{monthLabel(ym.y, ym.m)}</h1>
        <button className="icon-btn" onClick={() => step(1)} disabled={isCurrent} aria-label="Next month">
          ›
        </button>
      </header>

      <div className="summary-grid card">
        <div>
          <span className="muted small">Income ({currency})</span>
          <strong className="pos">{amount(s.income)}</strong>
        </div>
        <div>
          <span className="muted small">Spent</span>
          <strong className="neg">{amount(s.spent)}</strong>
        </div>
        <div>
          <span className="muted small">CC paid</span>
          <strong>{amount(s.cardPayments)}</strong>
        </div>
      </div>

      <div className="filters">
        <div className="segmented small">
          {(['ALL', 'EXPENSE', 'INCOME'] as Filter[]).map((f) => (
            <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>
              {f === 'ALL' ? 'All' : f === 'EXPENSE' ? 'Expenses' : 'Income'}
            </button>
          ))}
        </div>
        <div className="row">
          <select value={methodId} onChange={(e) => setMethodId(e.target.value)} className="grow">
            <option value="">All payment types</option>
            {paymentMethods.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <input className="grow" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {entries ? <EntryList entries={shown} empty="No entries for this month." /> : <p className="muted center pad">Loading…</p>}
    </div>
  )
}
