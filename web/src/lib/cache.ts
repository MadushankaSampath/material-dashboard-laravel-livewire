// Last-known cloud data kept on this device, so the app can show it instantly on
// start-up and refresh from SQL Connect in the background. Per signed-in user;
// cleared on sign-out. Storage can be unavailable (private mode), so every
// access is best-effort.

const PREFIX = 'pocketbook:v1:'

export function readCache<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : undefined
  } catch {
    return undefined
  }
}

export function writeCache(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* full or unavailable — the app still works, just without the instant start */
  }
}

export function removeCache(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    /* ignore */
  }
}

/** Removes everything cached for one user (on sign-out). */
export function clearUserCache(uid: string): void {
  try {
    const marker = `${PREFIX}${uid}:`
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i)
      if (k?.startsWith(marker)) localStorage.removeItem(k)
    }
  } catch {
    /* ignore */
  }
}

/** Remembers who was signed in last, so their data can be shown before Firebase Auth restores the session. */
export const LAST_UID_KEY = 'lastUid'

export function userKey(uid: string, key: string): string {
  return `${uid}:${key}`
}
