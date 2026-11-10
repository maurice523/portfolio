import { useCurrentWork } from '@/content/currentProject'
import { NotFoundPage } from './NotFoundPage'
import { ProjectView } from './ProjectPage'

// /currently-working-on: whatever /admin → Currently working picks (one of the projects, or a card
// made just for this), shown with the same page as any project. Only the back arrow differs: it
// leads home, where the button that opened this page is.
// Opened from the home page by a dot that swells into the page, and closed the same way in
// reverse (see PageTransition.tsx).
export function CurrentlyWorkingOnPage() {
  const work = useCurrentWork()
  if (!work) return <NotFoundPage />
  return <ProjectView project={work.project} back={{ to: '/', label: 'Back to home' }} />
}
