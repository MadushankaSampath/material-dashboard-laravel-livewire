import { useEffect, useState } from 'react'
import { QueryFetchPolicy } from 'firebase/data-connect'
import { cardActivity, listEntries, type CardActivityData } from '@pocketbook/dataconnect'
import { dc } from '../firebase'
import { readCache, userKey, writeCache } from '../lib/cache'
import type { Entry } from '../lib/types'
import { useApp } from './AppContext'
import { trackLoad } from './busy'

/**
 * Shows the copy of a query's result saved on this device straight away, then
 * fetches the latest from the cloud (with the top loading bar) and saves it.
 * Refetches whenever `cacheKey` or the app's dataVersion changes.
 */
function useCloudData<T>(cacheKey: string | null, fetch: () => Promise<T>) {
  const { dataVersion, uid } = useApp()
  const key = uid && cacheKey ? userKey(uid, cacheKey) : null
  const [fresh, setFresh] = useState<{ key: string; data: T }>()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!key) return
    let live = true
    trackLoad(fetch())
      .then((data) => {
        writeCache(key, data)
        if (live) {
          setFresh({ key, data })
          setError(null)
        }
      })
      .catch((e: Error) => live && setError(e.message))
    return () => {
      live = false
    }
    // `fetch` is recreated every render; `key` captures everything it depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, dataVersion])

  const data = key ? (fresh?.key === key ? fresh.data : readCache<T>(key)) : undefined
  return { data, error }
}

export function useEntries(from: string, to: string, enabled = true, limit = 500) {
  const { data, error } = useCloudData(enabled ? `entries:${from}:${to}:${limit}` : null, () =>
    listEntries(dc, { from, to, limit }, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY }).then(
      ({ data }) => data.member?.household.entries ?? ([] as Entry[]),
    ),
  )
  return { entries: data, error }
}

export function useCardActivity(since: string, enabled: boolean) {
  const { data } = useCloudData<CardActivityData>(enabled ? `cards:${since}` : null, () =>
    cardActivity(dc, { since }, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY }).then(({ data }) => data),
  )
  return data
}
