import { NavLink, Outlet } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import QuickAdd from './QuickAdd'

const tabs = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/history', label: 'History', icon: '🧾' },
  { to: '/cards', label: 'Accounts', icon: '💳' },
  { to: '/settings', label: 'Family', icon: '👪' },
]

export default function Layout() {
  const { openQuickAdd, quickAdd } = useApp()
  return (
    <div className="shell">
      <main>
        <Outlet />
      </main>

      <button className="fab-income" aria-label="Add income" onClick={() => openQuickAdd(undefined, 'INCOME')}>
        + Income
      </button>
      <button className="fab" aria-label="Add entry" onClick={() => openQuickAdd()}>
        +
      </button>

      <nav className="tabbar">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end className={({ isActive }) => (isActive ? 'on' : '')}>
            <span className="tab-icon">{t.icon}</span>
            {t.label}
          </NavLink>
        ))}
      </nav>

      {quickAdd.open && <QuickAdd key={quickAdd.seq} entry={quickAdd.entry} initialKind={quickAdd.kind} />}
    </div>
  )
}
