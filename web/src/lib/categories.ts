import { addCategory } from '@pocketbook/dataconnect'
import { dc } from '../firebase'
import type { Category, EntryKind } from './types'

/** Finds a category by name (case-insensitive) or creates it. `created` tells the caller to refresh. */
export async function ensureCategory(
  categories: Category[],
  name: string,
  kind: EntryKind,
  icon: string,
): Promise<{ id: string; created: boolean }> {
  const existing = categories.find((c) => c.kind === kind && c.name.toLowerCase() === name.toLowerCase())
  if (existing) return { id: existing.id, created: false }
  const { data } = await addCategory(dc, { name, kind, icon, sortOrder: 60 })
  return { id: data.category_insert.id, created: true }
}
