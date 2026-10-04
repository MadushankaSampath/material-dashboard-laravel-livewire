import { useState, type FormEvent } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase'
import { errorMessage } from '../lib/format'

type Mode = 'signin' | 'signup' | 'reset'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function run(fn: () => Promise<unknown>) {
    setBusy(true)
    setError(null)
    setInfo(null)
    try {
      await fn()
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    if (mode === 'signin') return run(() => signInWithEmailAndPassword(auth, email, password))
    if (mode === 'reset')
      return run(async () => {
        await sendPasswordResetEmail(auth, email)
        setInfo('Check your inbox for a reset link.')
      })
    return run(async () => {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: name.trim() })
      // Make the new name visible to the profile bootstrap in AppContext.
      await cred.user.reload()
    })
  }

  return (
    <div className="auth">
      <div className="auth-brand">
        <div className="logo">₨</div>
        <h1>Pocketbook</h1>
        <p className="muted">Daily income &amp; expenses for the whole family</p>
      </div>

      <form className="card stack" onSubmit={submit}>
        <div className="segmented">
          <button type="button" className={mode === 'signin' ? 'on' : ''} onClick={() => setMode('signin')}>
            Sign in
          </button>
          <button type="button" className={mode === 'signup' ? 'on' : ''} onClick={() => setMode('signup')}>
            Sign up
          </button>
        </div>

        {mode === 'signup' && (
          <label>
            Your name
            <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" maxLength={60} />
          </label>
        )}
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        {mode !== 'reset' && (
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </label>
        )}

        {error && <p className="error">{error}</p>}
        {info && <p className="ok">{info}</p>}

        <button className="btn primary" disabled={busy}>
          {mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
        </button>

        {mode !== 'reset' && (
          <>
            <div className="divider">or</div>
            <button
              type="button"
              className="btn"
              disabled={busy}
              onClick={() => run(() => signInWithPopup(auth, new GoogleAuthProvider()))}
            >
              Continue with Google
            </button>
          </>
        )}

        <button type="button" className="link" onClick={() => setMode(mode === 'reset' ? 'signin' : 'reset')}>
          {mode === 'reset' ? 'Back to sign in' : 'Forgot password?'}
        </button>
      </form>
    </div>
  )
}
