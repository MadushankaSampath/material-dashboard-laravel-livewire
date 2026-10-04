import { useEffect, useState } from 'react'
import { QueryFetchPolicy } from 'firebase/data-connect'
import { cardActivity, listEntries, type CardActivityData } from '@pocketbook/dataconnect'
import { dc } from '../firebase'
import type { Entry } from '../lib/types'
import { useApp } from './AppContext'

export function useEntries(from: string, to: string) {
  const { dataVersion } = useApp()
  const [entries, setEntries] = useState<Entry[]>()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    listEntries(dc, { from, to }, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY })
      .then(({ data }) => live && (setEntries(data.member?.household.entries ?? []), setError(null)))
      .catch((e: Error) => live && setError(e.message))
    return () => {
      live = false
    }
  }, [from, to, dataVersion])

  return { entries, error }
}

export function useCardActivity(since: string, enabled: boolean) {
  const { dataVersion } = useApp()
  const [data, setData] = useState<CardActivityData>()

  useEffect(() => {
    if (!enabled) return
    let live = true
    cardActivity(dc, { since }, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY })
      .then(({ data }) => live && setData(data))
      .catch(() => live && setData(undefined))
    return () => {
      live = false
    }
  }, [since, enabled, dataVersion])

  return data
}
