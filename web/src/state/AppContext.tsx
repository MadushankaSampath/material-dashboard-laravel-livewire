import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'
import { QueryFetchPolicy } from 'firebase/data-connect'
import { getMyHome, upsertMe, type GetMyHomeData } from '@pocketbook/dataconnect'
import { auth, dc } from '../firebase'
import type { Entry, Household } from '../lib/types'

interface QuickAddState {
  open: boolean
  entry?: Entry
  seq: number
}

interface AppState {
  authUser: FirebaseUser | null
  authReady: boolean
  home: GetMyHomeData | undefined
  household: Household | undefined
  homeLoading: boolean
  homeError: string | null
  refreshHome: () => Promise<void>
  /** Increments whenever entries change, so lists know to reload. */
  dataVersion: number
  dataChanged: () => void
  quickAdd: QuickAddState
  openQuickAdd: (entry?: Entry) => void
  closeQuickAdd: () => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [home, setHome] = useState<GetMyHomeData>()
  const [homeLoading, setHomeLoading] = useState(false)
  const [homeError, setHomeError] = useState<string | null>(null)
  const [dataVersion, setDataVersion] = useState(0)
  const [quickAdd, setQuickAdd] = useState<QuickAddState>({ open: false, seq: 0 })

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setAuthUser(u)
        setAuthReady(true)
        if (!u) setHome(undefined)
      }),
    [],
  )

  const refreshHome = useCallback(async () => {
    if (!auth.currentUser) return
    setHomeLoading(true)
    setHomeError(null)
    try {
      let { data } = await getMyHome(dc, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY })
      if (!data.user) {
        // First sign-in on this account: create the profile row.
        const u = auth.currentUser
        await upsertMe(dc, {
          displayName: u.displayName || u.email?.split('@')[0] || 'Me',
          email: u.email,
        })
        ;({ data } = await getMyHome(dc, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY }))
      }
      setHome(data)
    } catch (e) {
      setHomeError(e instanceof Error ? e.message : String(e))
    } finally {
      setHomeLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authUser) void refreshHome()
  }, [authUser, refreshHome])

  const value = useMemo<AppState>(
    () => ({
      authUser,
      authReady,
      home,
      household: home?.member?.household,
      homeLoading,
      homeError,
      refreshHome,
      dataVersion,
      dataChanged: () => setDataVersion((v) => v + 1),
      quickAdd,
      openQuickAdd: (entry) => setQuickAdd((q) => ({ open: true, entry, seq: q.seq + 1 })),
      closeQuickAdd: () => setQuickAdd((q) => ({ open: false, seq: q.seq })),
    }),
    [authUser, authReady, home, homeLoading, homeError, refreshHome, dataVersion, quickAdd],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used inside <AppProvider>')
  return v
}

/** Household is guaranteed once the user is past onboarding. */
export function useHousehold(): Household {
  const h = useApp().household
  if (!h) throw new Error('No household loaded')
  return h
}
