import clsx from 'clsx'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from 'motion/react'
import { useEffect, useState } from 'react'
import { useContent } from '@/content/context'
import { usePages, type PageId } from '@/content/pages'
import { PageLink } from './PageTransition'
import { usePageExit } from './pageExit'

// The home page menu: one giant word per page, each turned 45° away from the viewer around
// its right edge, so the list recedes toward the bass. Hovering a word turns it toward you and
// leaves only its outline. Clicking one turns it flat and solid while the others swing out of
// the way; then it floats up to become that page's title (a view transition, see
// PageTransition.tsx). Coming back runs the same in reverse: the title floats down into its
// place, the other words swing back in, and it turns back into the list.

const easeOut = [0.075, 0.82, 0.165, 1] as const
const easeIn = [0.55, 0.055, 0.675, 0.19] as const
/** When the words have swung in and start answering the pointer, in ms. */
const INTRO_MS = 1500
/** The same, coming back from a page, counted from when its title has landed. */
const RETURN_MS = 900

// Each word's angle. `custom` is [index, count]: words swing in and out from the bottom up.
// Every state sets opacity, since Motion would otherwise fade a word back to its hidden value.
const word: Variants = {
  hidden: { rotateY: -100, opacity: 0 },
  enter: ([i, count]: [number, number]) => ({
    rotateY: -45,
    opacity: 1,
    transition: {
      delay: 0.1 + (count - 1 - i) * 0.09,
      rotateY: { duration: 1.4, ease: easeOut },
      opacity: { duration: 0.5 },
    },
  }),
  rest: { rotateY: -45, opacity: 1, transition: { duration: 1.5, ease: easeOut } },
  hover: { rotateY: -35, opacity: 1, transition: { duration: 1, ease: easeOut } },
  away: ([i, count]: [number, number]) => ({
    rotateY: -114,
    opacity: 0,
    transition: { delay: 0.05 + (count - 1 - i) * 0.1, duration: 0.25, ease: easeIn },
  }),
  // Turns to face you, ready to float up to the page it opens
  chosen: { rotateY: 0, opacity: 1, transition: { duration: 0.8, ease: easeOut } },
  // Coming back: where the title lands, before it turns back into the list...
  flat: { rotateY: 0, opacity: 1 },
  // ...while the others wait where they swung away to...
  gone: { rotateY: -114, opacity: 0 },
  // ...and then swing back in, the reverse of "away": from the top down
  back: ([i]: [number, number]) => ({
    rotateY: -45,
    opacity: 1,
    transition: {
      delay: 0.05 + i * 0.1,
      rotateY: { duration: 1.1, ease: easeOut },
      opacity: { duration: 0.35 },
    },
  }),
}

// On the first visit the whole list drops in from above
const list: Variants = {
  hidden: { y: '-100%' },
  enter: { y: '0%', transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } },
}

/**
 * How the menu appears: "intro" swings it in (first visit), "return" lands the word whose page
 * you came back from, and "none" shows it as it is (e.g. after the back button).
 */
export type MenuEntrance = 'intro' | 'return' | 'none'

/** The small note beside each word. */
function useNotes(): Record<PageId, string> {
  const { projects, experience, settings } = useContent()
  const count = (n: number, noun: string) => `${n} ${noun}${n === 1 ? '' : 's'}`
  return {
    projects: count(projects.length, 'project'),
    experience: count(experience.length, 'role'),
    about: settings.profile.location,
    contact: settings.profile.email,
  }
}

export function WarpedMenu({
  entrance,
  className,
}: {
  entrance: MenuEntrance
  className?: string
}) {
  const pages = usePages()
  const notes = useNotes()
  const { leavingTo, arrivedFrom, landing } = usePageExit()
  const reduceMotion = useReducedMotion()
  const [entered, setEntered] = useState(entrance === 'none')
  const [hovered, setHovered] = useState<number | null>(null)
  // The word that floats up to its page, or back down from it
  const chosen = pages.findIndex((page) => page.to === leavingTo)
  const landed = entrance === 'return' ? pages.findIndex((page) => page.to === arrivedFrom) : -1
  let phase: 'enter' | 'land' | 'leave' | 'idle' = 'idle'
  if (leavingTo) phase = 'leave'
  else if (entrance === 'return' && landing) phase = 'land'
  else if (!entered) phase = 'enter'

  // Answer the pointer once the words have swung in (after the title has landed, coming back)
  useEffect(() => {
    if (entered || phase === 'land') return
    const timer = setTimeout(() => setEntered(true), entrance === 'intro' ? INTRO_MS : RETURN_MS)
    return () => clearTimeout(timer)
  }, [entered, phase, entrance])

  // The vanishing point follows the pointer up and down, so the words shift as you move
  const pointerY = useMotionValue(50)
  const originY = useSpring(pointerY, { stiffness: 30, damping: 18 })
  const perspectiveOrigin = useTransform(originY, (y) => `50% ${y}%`)
  useEffect(() => {
    if (reduceMotion) return
    const follow = (event: PointerEvent) =>
      pointerY.set(30 + 40 * (event.clientY / window.innerHeight))
    window.addEventListener('pointermove', follow)
    return () => window.removeEventListener('pointermove', follow)
  }, [pointerY, reduceMotion])

  function stateOf(i: number) {
    if (phase === 'leave') return i === chosen ? 'chosen' : 'away'
    if (phase === 'land') return i === landed ? 'flat' : 'gone'
    if (phase === 'enter') {
      if (entrance === 'intro') return 'enter'
      return i === landed ? 'rest' : 'back'
    }
    return i === hovered ? 'hover' : 'rest'
  }

  return (
    <motion.nav
      aria-label="Pages"
      style={{ perspectiveOrigin }}
      className={clsx(
        'flex items-center justify-end [perspective:250vw] sm:[perspective:100vw]',
        className,
      )}
    >
      <motion.ul
        variants={list}
        initial={entrance === 'intro' ? 'hidden' : false}
        animate="enter"
        // Only the words take the pointer: the flat list items would sit in front of them in
        // 3D and catch clicks first
        className="pointer-events-none w-full text-right [transform-style:preserve-3d]"
      >
        {pages.map((page, i) => {
          const travelling =
            (phase === 'leave' && i === chosen) || (phase === 'land' && i === landed)
          return (
            <li key={page.id} className="[transform-style:preserve-3d]">
              <motion.div
                custom={[i, pages.length]}
                variants={word}
                initial={
                  entrance === 'intro'
                    ? 'hidden'
                    : entrance === 'return'
                      ? i === landed
                        ? 'flat'
                        : 'gone'
                      : 'rest'
                }
                animate={stateOf(i)}
                className="origin-right [transform-style:preserve-3d]"
              >
                <PageLink
                  to={page.to}
                  onPointerEnter={() => setHovered(i)}
                  onPointerLeave={() => setHovered(null)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  data-outlined={phase === 'idle' && i === hovered}
                  data-travelling={travelling}
                  className={clsx(
                    'group',
                    // Right-aligned with flex so a word wider than the box spills out to the left,
                    // where the turn shrinks it, instead of off the right edge of the screen
                    'flex justify-end font-display text-[9.8vw] leading-[0.92] font-black tracking-[0.01em] text-accent uppercase [font-stretch:125%] transition-[color] duration-300 [-webkit-text-stroke:max(1px,0.02em)_var(--color-accent)] data-[outlined=true]:text-transparent sm:text-[9.4vw]',
                    // Not clickable until the words have swung in
                    phase === 'idle' && 'pointer-events-auto',
                  )}
                >
                  <span
                    // Matches the page title, so the browser morphs one into the other
                    style={{ viewTransitionName: travelling ? 'page-title' : undefined }}
                    className="relative inline-block"
                  >
                    {/* Note and slash, left of the word and turned with it. They step aside
                        while the word travels. */}
                    <span
                      aria-hidden="true"
                      className="absolute top-[0.2em] right-[calc(100%+0.42em)] whitespace-nowrap transition-opacity duration-300 group-data-[travelling=true]:opacity-0 max-sm:hidden"
                    >
                      <span className="block font-sans text-[max(0.6875rem,0.1em)] font-medium tracking-normal text-fg normal-case [font-stretch:100%] [-webkit-text-stroke:0]">
                        {notes[page.id]}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute top-[0.16em] left-[-0.26em] h-[0.62em] w-[max(1px,0.014em)] rotate-[25deg] bg-accent transition-opacity duration-300 group-data-[travelling=true]:opacity-0"
                    />
                    {page.label}
                  </span>
                </PageLink>
              </motion.div>
            </li>
          )
        })}
      </motion.ul>
    </motion.nav>
  )
}
