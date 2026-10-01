import { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react'
import type { z } from 'zod'
import { useContentState } from '@/content/context'
import { formatIssues, type Content } from '@/shared/schema'

// Unsaved edits for every admin page, kept in AdminApp so switching pages doesn't lose them.
export type Drafts = Record<string, unknown>
export const DraftsContext = createContext<{
  drafts: Drafts
  setDrafts: Dispatch<SetStateAction<Drafts>>
} | null>(null)

function useDrafts() {
  const value = useContext(DraftsContext)
  if (!value) throw new Error('useEditor must be used inside AdminApp')
  return value
}

export function isDirty(drafts: Drafts, id: string, saved: unknown) {
  return id in drafts && JSON.stringify(drafts[id]) !== JSON.stringify(saved)
}

type Status =
  { kind: 'idle' } | { kind: 'saving' } | { kind: 'saved' } | { kind: 'error'; message: string }

/**
 * Editing state for one admin page: the draft, whether it differs from what's saved,
 * and save/discard actions. `save` sends the draft to the API, which returns fresh content.
 */
export function useEditor<T>({
  id,
  saved,
  schema,
  save,
}: {
  id: string
  saved: T
  schema: z.ZodType<T>
  save: (value: T) => Promise<Content>
}) {
  const { drafts, setDrafts } = useDrafts()
  const { setContent } = useContentState()
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const draft = (id in drafts ? drafts[id] : saved) as T
  const dirty = isDirty(drafts, id, saved)

  function setDraft(next: T | ((current: T) => T)) {
    setStatus({ kind: 'idle' })
    setDrafts((prev) => {
      const current = (id in prev ? prev[id] : saved) as T
      const value = typeof next === 'function' ? (next as (current: T) => T)(current) : next
      return { ...prev, [id]: value }
    })
  }

  function discard() {
    setStatus({ kind: 'idle' })
    setDrafts(({ [id]: _removed, ...rest }) => rest)
  }

  async function submit() {
    // Check here first for a quick, specific message; the Worker checks again before saving.
    const result = schema.safeParse(draft)
    if (!result.success) {
      setStatus({ kind: 'error', message: formatIssues(result.error) })
      return
    }
    setStatus({ kind: 'saving' })
    try {
      setContent(await save(result.data))
      setDrafts(({ [id]: _removed, ...rest }) => rest)
      setStatus({ kind: 'saved' })
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : String(err) })
    }
  }

  return { draft, setDraft, dirty, discard, submit, status }
}

export type Editor<T> = ReturnType<typeof useEditor<T>>
