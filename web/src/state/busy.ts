import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

// App-wide count of actions in progress (saving, deleting, signing in...).
// While it is above zero the BusyOverlay shows a top loading bar and greys out the screen.
let active = 0
const listeners = new Set<() => void>()

function change(delta: number) {
  active = Math.max(0, active + delta)
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useAnyBusy(): boolean {
  return useSyncExternalStore(subscribe, () => active > 0)
}

/**
 * Drop-in replacement for `useState(false)` for a component's busy flag that also
 * drives the global overlay. Releases its hold if the component unmounts mid-action
 * (e.g. a sheet that closes itself on success).
 */
export function useBusy(): [boolean, (busy: boolean) => void] {
  const [busy, setLocal] = useState(false)
  const holding = useRef(false)

  const setBusy = useCallback((next: boolean) => {
    if (next !== holding.current) {
      holding.current = next
      change(next ? 1 : -1)
    }
    setLocal(next)
  }, [])

  useEffect(
    () => () => {
      if (holding.current) {
        holding.current = false
        change(-1)
      }
    },
    [],
  )

  return [busy, setBusy]
}
