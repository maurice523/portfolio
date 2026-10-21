import type { SectionId } from '@/shared/schema'
import { useContent } from './context'

// The site's pages, in menu order. Skills has no page of its own: it's part of About.
const pageOrder = ['projects', 'experience', 'about', 'contact'] as const satisfies SectionId[]
export type PageId = (typeof pageOrder)[number]

export type PageInfo = {
  id: PageId
  to: string
  /** Name on the home page menu, from the section's menu label in /admin. */
  label: string
}

/** Pages that have a menu label in /admin; one without a label is left off the home page menu. */
export function usePages(): PageInfo[] {
  const { sections } = useContent().settings
  return pageOrder
    .filter((id) => sections[id].navLabel)
    .map((id) => ({ id, to: `/${id}`, label: sections[id].navLabel }))
}
