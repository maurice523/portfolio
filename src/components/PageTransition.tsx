import { useReducedMotion } from 'motion/react'
import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import {
  Link,
  useLocation,
  useNavigate,
  useNavigationType,
  type LinkProps,
  type Location,
} from 'react-router'
import { PageExitContext, usePageExit } from './pageExit'

// Page changes run in three steps. Links inside the site go through leave(), so:
// 1. The current page clears away what won't come along (see exitMs below).
// 2. The browser morphs the old page into the new one with a view transition. Elements that
//    carry the same view-transition-name on both pages travel between them: the home menu word
//    and the page title ("page-title"), and a project's title and image between its row on the
//    projects page and its own page ("project-title", "project-image"). Timing is in index.css.
// 3. The new page settles into place.

/** How long the current page takes to clear away before the morph, in ms. */
function exitMs(from: string) {
  // Home: the other menu words swing out and the bass sinks. Elsewhere: everything but what
  // travels fades out.
  return from === '/' ? 900 : 300
}

export function PageTransitions({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const navigationType = useNavigationType()
  const reduceMotion = useReducedMotion()
  // Tied to the location it started from, so it ends by itself once any navigation happens
  // (including the back button halfway through)
  const [exit, setExit] = useState<{ from: Location; to: string } | null>(null)
  const leavingTo = exit?.from === location ? exit.to : null
  // The last page change made by a site link. The back and forward buttons don't count.
  const [trip, setTrip] = useState<{ from: string; to: string } | null>(null)
  const arrivedFrom = navigationType === 'PUSH' && trip?.to === location.pathname ? trip.from : null
  const [landing, setLanding] = useState(false)
  // Resolves the view transition's update once the new page has rendered
  const rendered = useRef<(() => void) | null>(null)

  useLayoutEffect(() => {
    rendered.current?.()
    rendered.current = null
  }, [location])

  function go(to: string) {
    setTrip({ from: location.pathname, to })
    navigate(to)
  }

  const finishExit = useEffectEvent((to: string) => {
    if (!('startViewTransition' in document)) {
      go(to)
      return
    }

    const transition = document.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          rendered.current = resolve
          // Never leave the page frozen if the new page somehow doesn't render
          setTimeout(resolve, 1000)
          setLanding(true)
          go(to)
        }),
    )
    void transition.finished.finally(() => setLanding(false))
  })

  useEffect(() => {
    if (!leavingTo) return
    const timer = setTimeout(() => finishExit(leavingTo), exitMs(location.pathname))
    return () => clearTimeout(timer)
  }, [leavingTo, location.pathname])

  function leave(to: string) {
    if (leavingTo || landing || to === location.pathname) return
    if (reduceMotion) go(to)
    else setExit({ from: location, to })
  }

  return (
    <PageExitContext value={{ leavingTo, arrivedFrom, landing, leave }}>{children}</PageExitContext>
  )
}

/**
 * A Link that lets the current page animate out first. Cmd/Ctrl-click, middle-click and
 * new-tab links behave like normal links.
 */
export function PageLink({ to, onClick, ...props }: LinkProps & { to: string }) {
  const { leave } = usePageExit()

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    if (event.defaultPrevented || event.button !== 0 || modified || props.target) return
    event.preventDefault()
    leave(to)
  }

  return <Link to={to} onClick={handleClick} {...props} />
}
