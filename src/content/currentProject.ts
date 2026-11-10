import type { Project } from '@/shared/schema'
import { useContent } from './context'

/** Where the "Currently working on" page lives. */
export const CURRENT_PROJECT_PATH = '/currently-working-on'

/**
 * Between the home page and the "Currently working on" page the page changes with a swelling
 * dot (see PageTransition.tsx), not the way the other pages open.
 */
export function isBloomTrip(from: string | null, to: string | null) {
  return (
    (from === '/' && to === CURRENT_PROJECT_PATH) || (from === CURRENT_PROJECT_PATH && to === '/')
  )
}

export type CurrentWork = {
  /** The project to show: one of the projects, or the card made for this. */
  project: Project
  blurb: string
}

/** What /admin → Currently working picks; null when it's set to show nothing. */
export function useCurrentWork(): CurrentWork | null {
  const { projects, settings } = useContent()
  const { mode, slug, blurb, custom } = settings.currentlyWorking

  if (mode === 'project') {
    const project = projects.find((item) => item.slug === slug)
    return project ? { project, blurb } : null
  }
  if (mode === 'custom' && custom.title) {
    return { project: { ...custom, slug: 'currently-working-on', section: '' }, blurb }
  }
  return null
}
