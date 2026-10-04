import { useState, type FormEvent } from 'react'
import { signOut, updateProfile } from 'firebase/auth'
import {
  addCategory,
  archiveCategory,
  leaveHousehold,
  removeMember,
  updateHousehold,
  upsertMe,
} from '@pocketbook/dataconnect'
import { auth, dc } from '../firebase'
import { errorMessage } from '../lib/format'
import { CURRENCIES, type EntryKind } from '../lib/types'
import { useApp, useHousehold } from '../state/AppContext'

export default function SettingsPage() {
  const { home, authUser, refreshHome } = useApp()
  const household = useHousehold()
  const isOwner = home?.member?.role === 'OWNER'
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function run(fn: () => Promise<unknown>) {
    setError(null)
    try {
      await fn()
      await refreshHome()
    } catch (e) {
      setError(errorMessage(e))
    }
  }

  async function shareInvite() {
    const text = `Join "${household.name}" on Pocketbook with invite code ${household.inviteCode} — ${location.origin}`
    try {
      if (navigator.share) await navigator.share({ title: 'Pocketbook invite', text })
      else {
        await navigator.clipboard.writeText(household.inviteCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      /* user cancelled share */
    }
  }

  return (
    <div className="page stack">
      <h1>Family &amp; settings</h1>
      {error && <p className="error">{error}</p>}

      <ProfileForm name={home?.user?.displayName ?? ''} onSave={(n) => run(() => saveName(n, home?.user?.email))} />

      <section className="card stack">
        <h2>👪 {household.name}</h2>
        <p className="muted small">Share this code so your partner can sign up and join. Each person keeps their own login.</p>
        <div className="invite">
          <code>{household.inviteCode}</code>
          <button className="btn small" onClick={shareInvite}>
            {copied ? 'Copied ✓' : 'Share'}
          </button>
        </div>
        <ul className="list">
          {household.members.map((m) => (
            <li key={m.user.id} className="member">
              <span className="avatar">{m.user.displayName.slice(0, 1).toUpperCase()}</span>
              <span className="grow">
                {m.user.displayName}
                {m.user.id === authUser?.uid && ' (you)'}
                <span className="muted small block">{m.user.email}</span>
              </span>
              <span className="badge">{m.role === 'OWNER' ? 'Owner' : 'Member'}</span>
              {isOwner && m.user.id !== authUser?.uid && (
                <button
                  className="icon-btn"
                  aria-label={`Remove ${m.user.displayName}`}
                  onClick={() =>
                    confirm(`Remove ${m.user.displayName} from the household?`) &&
                    run(() => removeMember(dc, { userId: m.user.id }))
                  }
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
        <HouseholdForm
          name={household.name}
          currency={household.currency}
          onSave={(name, currency) => run(() => updateHousehold(dc, { name, currency }))}
        />
      </section>

      <Categories onChange={run} />

      <section className="card stack">
        <button className="btn" onClick={() => signOut(auth)}>
          Sign out
        </button>
        <button
          className="btn danger"
          onClick={() =>
            confirm('Leave this household? You will no longer see its entries.') && run(() => leaveHousehold(dc))
          }
        >
          Leave household
        </button>
      </section>
    </div>
  )
}

async function saveName(displayName: string, email: string | null | undefined) {
  if (auth.currentUser) await updateProfile(auth.currentUser, { displayName })
  await upsertMe(dc, { displayName, email })
}

function ProfileForm({ name, onSave }: { name: string; onSave: (name: string) => Promise<void> }) {
  const [value, setValue] = useState(name)
  return (
    <form
      className="card row"
      onSubmit={(e: FormEvent) => {
        e.preventDefault()
        void onSave(value.trim())
      }}
    >
      <label className="grow">
        Your name
        <input value={value} onChange={(e) => setValue(e.target.value)} required maxLength={60} />
      </label>
      <button className="btn small align-end" disabled={!value.trim() || value.trim() === name}>
        Save
      </button>
    </form>
  )
}

function HouseholdForm(props: { name: string; currency: string; onSave: (n: string, c: string) => Promise<void> }) {
  const [name, setName] = useState(props.name)
  const [currency, setCurrency] = useState(props.currency)
  const dirty = name.trim() !== props.name || currency !== props.currency
  return (
    <form
      className="row"
      onSubmit={(e) => {
        e.preventDefault()
        void props.onSave(name.trim(), currency)
      }}
    >
      <label className="grow2">
        Household name
        <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={60} />
      </label>
      <label className="grow">
        Currency
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {CURRENCIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      {dirty && <button className="btn small align-end">Save</button>}
    </form>
  )
}

function Categories({ onChange }: { onChange: (fn: () => Promise<unknown>) => Promise<void> }) {
  const { categories } = useHousehold()
  const [kind, setKind] = useState<EntryKind>('EXPENSE')
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const shown = categories.filter((c) => c.kind === kind)

  return (
    <section className="card stack">
      <div className="section-head">
        <h2>Categories</h2>
        <div className="segmented small">
          <button className={kind === 'EXPENSE' ? 'on' : ''} onClick={() => setKind('EXPENSE')}>
            Expense
          </button>
          <button className={kind === 'INCOME' ? 'on' : ''} onClick={() => setKind('INCOME')}>
            Income
          </button>
        </div>
      </div>
      <div className="chips">
        {shown.map((c) => (
          <span key={c.id} className="chip">
            {c.icon} {c.name}
            {!c.systemKey && (
              <button
                className="chip-x"
                aria-label={`Remove ${c.name}`}
                onClick={() => confirm(`Remove category ${c.name}?`) && onChange(() => archiveCategory(dc, { id: c.id }))}
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault()
          void onChange(() =>
            addCategory(dc, { name: name.trim(), kind, icon: icon.trim() || null, sortOrder: 50 }),
          ).then(() => {
            setName('')
            setIcon('')
          })
        }}
      >
        <input className="emoji-input" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🙂" maxLength={4} aria-label="Icon" />
        <input className="grow" value={name} onChange={(e) => setName(e.target.value)} placeholder="New category" required maxLength={40} />
        <button className="btn small">Add</button>
      </form>
    </section>
  )
}
