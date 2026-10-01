// Calls to the Worker's /api/admin endpoints (see worker/index.ts).
import type { CollectionKey, Content, Settings, SettingsKey } from '@/shared/schema'

export type MediaItem = { key: string; url: string; size: number; type: string; uploaded: string }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // "manual" so an expired Access login (a redirect to the login page) shows up as an error here.
  const response = await fetch(`/api/admin/${path}`, { ...init, redirect: 'manual' })
  if (response.type === 'opaqueredirect' || response.status === 403) {
    throw new Error('Your admin login has expired. Reload the page to sign in again.')
  }
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new Error(body?.error ?? `Request failed (${response.status})`)
  return body as T
}

const putJson = <T>(path: string, data: unknown) =>
  request<T>(path, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
  })

/** Saves one settings group and returns the updated site content. */
export const saveSettings = <K extends SettingsKey>(key: K, value: Settings[K]) =>
  putJson<Content>(`settings/${key}`, value)

/** Replaces a whole list (projects, experience or themes) and returns the updated content. */
export const saveCollection = <K extends CollectionKey>(key: K, list: Content[K]) =>
  putJson<Content>(key, list)

export const listMedia = () => request<MediaItem[]>('media')

export function uploadMedia(file: File) {
  const form = new FormData()
  form.append('file', file)
  return request<MediaItem>('media', { method: 'POST', body: form })
}

export const deleteMedia = (key: string) =>
  request<{ ok: true }>(`media/${encodeURIComponent(key)}`, { method: 'DELETE' })
