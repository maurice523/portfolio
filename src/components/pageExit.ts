import type { MotionProps } from 'motion/react'
import { createContext, use } from 'react'
import { useLocation } from 'react-router'

type PageExit = {
  /** Where the current page is headed while it animates out; null otherwise. */
  leavingTo: string | null
  /** The page a site link brought you here from; null after a reload or the back button. */
  arrivedFrom: string | null
  /** True while the browser morphs the old page into the new one (a view transition). */
  landing: boolean
  leave: (to: string) => void
}

export const PageExitContext = createContext<PageExit>({
  leavingTo: null,
  arrivedFrom: null,
  landing: false,
  leave: () => {},
})

/** Where the current page is in a page change (see PageTransition.tsx). */
export const usePageExit = () => use(PageExitContext)

const ease = [0.16, 1, 0.3, 1] as const
const easeIn = [0.55, 0.055, 0.675, 0.19] as const

/**
 * Motion props for the parts of a page that make way while a title (and a project's image)
 * travels between pages: they fade out before the page changes and, on the new page, fade in
 * once it has landed. Pass travels = true for a travelling element, which stays put.
 */
export function useSurroundings(travels = false): MotionProps {
  const { leavingTo, arrivedFrom } = usePageExit()
  const { pathname } = useLocation()
  if (travels) return { initial: false, animate: { opacity: 1, y: 0 } }

  // Opened from the home page, or from a level up (the projects page → a project): the rest
  // fades in as the travellers land. Back from a level down: it's already in place. Otherwise
  // (a direct visit, the back button): everything fades up.
  const deeper = arrivedFrom === '/' || (!!arrivedFrom && pathname.startsWith(`${arrivedFrom}/`))
  const entrance = !arrivedFrom ? 'fade' : deeper ? 'after-landing' : 'none'
  const leaving = leavingTo !== null

  return {
    initial: entrance === 'none' ? false : { opacity: 0, y: entrance === 'fade' ? 16 : 0 },
    animate: { opacity: leaving ? 0 : 1, y: 0 },
    transition: leaving
      ? { duration: 0.3, ease: easeIn }
      : { delay: entrance === 'after-landing' ? 0.55 : 0.15, duration: 0.8, ease },
  }
}
