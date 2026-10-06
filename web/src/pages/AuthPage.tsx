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

/** Friendly text for Firebase Auth error codes; anything else falls back to the raw message. */
const AUTH_ERRORS: Record<string, string> = {
  'auth/invalid-credential': 'Invalid email or password. Please try again, or sign up to create a new account.',
  'auth/wrong-password': 'Invalid email or password. Please try again, or sign up to create a new account.',
  'auth/user-not-found': 'Invalid email or password. Please try again, or sign up to create a new account.',
  'auth/invalid-email': 'That email address doesn’t look right.',
  'auth/missing-password': 'Enter your password.',
  'auth/email-already-in-use': 'An account with this email already exists. Sign in instead, or reset your password.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please wait a minute and try again.',
  'auth/network-request-failed': 'No internet connection. Check your network and try again.',
  'auth/popup-blocked': 'The sign-in popup was blocked. Allow popups for this site and try again.',
}

function authErrorMessage(e: unknown): string | null {
  const code = (e as { code?: string })?.code
  // The user just closed the Google popup — nothing to report.
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null
  return (code && AUTH_ERRORS[code]) || errorMessage(e)
}

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
      setError(authErrorMessage(e))
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

      <footer className="app-version">
        Pocketbook v{__APP_VERSION__}
        {__APP_COMMIT__ && ` · ${__APP_COMMIT__}`} · {__APP_BUILD_DATE__}
      </footer>
    </div>
  )
}
