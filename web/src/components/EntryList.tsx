import { dayLabel, money } from '../lib/format'
import { CC_PAYMENT, paymentIcon, type Entry } from '../lib/types'
import { useApp, useHousehold } from '../state/AppContext'

export default function EntryList({ entries, empty }: { entries: Entry[]; empty?: string }) {
  const { openQuickAdd, authUser } = useApp()
  const { currency, members } = useHousehold()
  const showWho = members.length > 1

  if (entries.length === 0) return <p className="muted center pad">{empty ?? 'Nothing here yet.'}</p>

  const days: [string, Entry[]][] = []
  for (const e of entries) {
    const last = days[days.length - 1]
    if (last && last[0] === e.date) last[1].push(e)
    else days.push([e.date, [e]])
  }

  return (
    <div className="entry-list">
      {days.map(([date, rows]) => (
        <section key={date}>
          <h3 className="day">
            <span>{dayLabel(date)}</span>
            <span>
              {money(
                rows.reduce((s, r) => s + (r.kind === 'INCOME' ? r.amount : -r.amount), 0),
                currency,
              )}
            </span>
          </h3>
          {rows.map((e) => (
            <button key={e.id} className="entry" onClick={() => openQuickAdd(e)}>
              <span className="entry-icon">{e.category?.icon ?? '•'}</span>
              <span className="entry-main">
                <span className="entry-title">
                  {e.category?.name ?? 'Uncategorised'}
                  {e.category?.systemKey === CC_PAYMENT && e.paidCard && ` → ${e.paidCard.name}`}
                </span>
                <span className="entry-sub">
                  {e.paymentMethod && `${paymentIcon(e.paymentMethod.type)} ${e.paymentMethod.name}`}
                  {e.note && ` · ${e.note}`}
                  {showWho && ` · ${e.createdBy.id === authUser?.uid ? 'You' : e.createdBy.displayName}`}
                </span>
              </span>
              <span className={`entry-amount ${e.kind === 'INCOME' ? 'pos' : ''}`}>
                {e.kind === 'INCOME' ? '+' : '−'}
                {money(e.amount, currency)}
              </span>
            </button>
          ))}
        </section>
      ))}
    </div>
  )
}
