import { useAnyBusy } from '../state/busy'

/** Top progress line + greyed-out, click-blocking screen while an action is saving. */
export default function BusyOverlay() {
  const busy = useAnyBusy()
  if (!busy) return null
  return (
    <div className="busy-overlay" role="progressbar" aria-label="Saving…" aria-busy="true">
      <div className="busy-bar" />
    </div>
  )
}
