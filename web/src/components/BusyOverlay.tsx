import { useAnyBusy, useAnyLoading } from '../state/busy'

/**
 * Saving: top progress line + greyed-out, click-blocking screen.
 * Background refresh from the cloud: just the top line, the app stays usable.
 */
export default function BusyOverlay() {
  const busy = useAnyBusy()
  const loading = useAnyLoading()
  if (busy)
    return (
      <div className="busy-overlay" role="progressbar" aria-label="Saving…" aria-busy="true">
        <div className="busy-bar" />
      </div>
    )
  if (loading) return <div className="busy-bar fixed" role="progressbar" aria-label="Loading…" />
  return null
}
