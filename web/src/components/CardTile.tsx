import type { CardStatus } from '../lib/cards'
import { money, shortDate } from '../lib/format'

export default function CardTile({ status, currency, onClick }: { status: CardStatus; currency: string; onClick?: () => void }) {
  const { card, available, balance, limit, utilisation } = status
  const level = utilisation > 0.8 ? 'high' : utilisation > 0.5 ? 'mid' : 'low'
  return (
    <button type="button" className="cc" onClick={onClick}>
      <div className="cc-top">
        <span className="cc-name">💳 {card.name}</span>
        {card.paymentDueDate && <span className="cc-due">Due {shortDate(card.paymentDueDate)}</span>}
      </div>
      <div className="cc-available">{money(available, currency)}</div>
      <div className="cc-label">available of {money(limit, currency)}</div>
      <div className={`meter ${level}`}>
        <span style={{ width: `${utilisation * 100}%` }} />
      </div>
      <div className="cc-foot">
        <span>Balance {money(balance, currency)}</span>
        <span>Statement {money(card.lastStatementBalance ?? 0, currency)}</span>
      </div>
    </button>
  )
}
