import { createContext, useContext } from 'react'
import type { Content } from '@/shared/schema'

export type ContentState = {
  content: Content
  /** Replace the content, e.g. with the fresh copy the API returns after an admin save. */
  setContent: (content: Content) => void
}

export const ContentContext = createContext<ContentState | null>(null)

export function useContentState(): ContentState {
  const state = useContext(ContentContext)
  if (!state) throw new Error('useContent must be used inside <ContentProvider>')
  return state
}

/** All site content: settings, projects, experience and themes. */
export function useContent(): Content {
  return useContentState().content
}
