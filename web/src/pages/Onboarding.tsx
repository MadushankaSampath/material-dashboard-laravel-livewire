import { useState, type FormEvent } from 'react'
import { signOut } from 'firebase/auth'
import { createHousehold, joinHousehold } from '@pocketbook/dataconnect'
import { auth, dc } from '../firebase'
import { errorMessage, newInviteCode } from '../lib/format'
import { CURRENCIES } from '../lib/types'
import { useApp } from '../state/AppContext'

export default function Onboarding() {
  const { home, refreshHome } = useApp()
  const firstName = home?.user?.displayName.split(' ')[0] ?? ''
  const [name, setName] = useState(firstName ? `${firstName}'s family` : 'Our family')
  const [currency, setCurrency] = useState('LKR')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run(fn: () => Promise<unknown>) {
    setBusy(true)
    setError(null)
    try {
      await fn()
      await refreshHome()
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  function create(e: FormEvent) {
    e.preventDefault()
    void run(() => createHousehold(dc, { name: name.trim(), currency, inviteCode: newInviteCode() }))
  }

  function join(e: FormEvent) {
    e.preventDefault()
    void run(() => joinHousehold(dc, { inviteCode: code.trim().toUpperCase() }))
  }

  return (
    <div className="page narrow stack">
      <h1>Welcome{firstName && `, ${firstName}`} 👋</h1>
      <p className="muted">
        Start a new household book, or join your partner&apos;s with their invite code. Everyone in a household sees
        the same income, expenses and cards — each with their own login.
      </p>

      {error && <p className="error">{error}</p>}

      <form className="card stack" onSubmit={create}>
        <h2>Start a new household</h2>
        <label>
          Household name
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={60} />
        </label>
        <label>
          Currency
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <button className="btn primary" disabled={busy}>
          Create
        </button>
      </form>

      <form className="card stack" onSubmit={join}>
        <h2>Join a family member</h2>
        <label>
          Invite code
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. 7KQ2MXRA"
            required
            autoCapitalize="characters"
            className="code-input"
          />
        </label>
        <button className="btn" disabled={busy}>
          Join household
        </button>
      </form>

      <button className="link" onClick={() => signOut(auth)}>
        Sign out
      </button>
    </div>
  )
}
