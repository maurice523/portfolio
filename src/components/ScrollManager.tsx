import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router'
import { usePageExit } from './pageExit'

// Each new page starts at the top ("instant" skips the smooth scrolling set on <html>), except
// when you come back from a project: then the projects page opens at that project's card, which
// the project page shrinks into. A layout effect, so it's done before the page change animates.
export function ScrollManager() {
  const { pathname } = useLocation()
  const { arrivedFrom } = usePageExit()

  useLayoutEffect(() => {
    const card = arrivedFrom && document.querySelector(`[data-card-for="${arrivedFrom}"]`)
    if (card) card.scrollIntoView({ block: 'center', behavior: 'instant' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, arrivedFrom])

  return null
}
