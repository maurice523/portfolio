import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { BassGuitar } from '@/components/BassGuitar'
import { GitHubIcon, LinkedInIcon, MailIcon } from '@/components/icons'
import { usePageExit } from '@/components/pageExit'
import { PageLink } from '@/components/PageTransition'
import { WarpedMenu, type MenuEntrance } from '@/components/WarpedMenu'
import { useContent } from '@/content/context'
import { CURRENT_PROJECT_PATH, useCurrentWork } from '@/content/currentProject'
import { usePages } from '@/content/pages'

const ease = [0.16, 1, 0.3, 1] as const

const iconLink =
  'grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-accent hover:text-accent'

// The intro (the bass rising, the menu dropping and swinging in) plays once per visit: on the
// first load or a refresh. Coming back from a page plays the exit in reverse instead.
let introPlayed = false

// One screen: the bass standing on the left, the page menu on the right, and a short
// introduction along the bottom.
export function HomePage() {
  const { profile, hero } = useContent().settings
  const { leavingTo, arrivedFrom, landing } = usePageExit()
  // Opening "Currently working on" fills the screen with a swelling dot instead (see
  // index.css), so nothing here clears away, and coming back from it nothing needs to land
  const leaving = leavingTo !== null && leavingTo !== CURRENT_PROJECT_PATH
  const fromBloom = arrivedFrom === CURRENT_PROJECT_PATH
  const work = useCurrentWork()
  const [entrance] = useState<MenuEntrance>(() => {
    if (fromBloom) return 'none'
    if (arrivedFrom) return 'return'
    return introPlayed ? 'none' : 'intro'
  })
  const intro = entrance === 'intro'
  // Back from a page: the bass and the text wait out of sight until its title has landed
  const waiting = entrance === 'return' && landing
  const hidden = leaving || waiting
  const [bubbleSettled, setBubbleSettled] = useState(false)
  // The button's dot swells into a full-screen circle of the accent color when it's clicked
  // (`bloom`: where it starts and how big it ends up). Coming back, the screen starts out full of
  // that color and shrinks into the dot, uncovering the page (`uncovering`).
  const dot = useRef<HTMLSpanElement>(null)
  const [bloom, setBloom] = useState<{ x: number; y: number; radius: number; from: number } | null>(
    null,
  )
  const reduceMotion = useReducedMotion()
  const [uncovering, setUncovering] = useState(fromBloom && !!work && !reduceMotion)
  useOldSectionLinks()

  // Seconds until the button's flourish first plays (after the button has appeared). It then
  // repeats every few seconds (see cta-hop in index.css).
  const flourishAt = intro ? 3.6 : 1.8

  useEffect(() => {
    const timer = setTimeout(() => setBubbleSettled(true), 2600)
    return () => clearTimeout(timer)
  }, [])

  // Tells index.css where the dot is, for the circle that shrinks into it. Returns its box.
  function markDot() {
    const box = dot.current?.getBoundingClientRect()
    if (!box) return null
    const root = document.documentElement.style
    root.setProperty('--bloom-x', `${box.left + box.width / 2}px`)
    root.setProperty('--bloom-y', `${box.top + box.height / 2}px`)
    root.setProperty('--bloom-dot', `${box.width / 2}px`)
    return box
  }

  function startBloom() {
    const box = markDot()
    if (!box) return
    const x = box.left + box.width / 2
    const y = box.top + box.height / 2
    // Far enough to reach the farthest corner of the screen
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )
    setBloom({ x, y, radius, from: box.width / (2 * radius) })
  }

  // Coming back: the circle needs to know where the dot is before it first paints
  useLayoutEffect(() => {
    if (uncovering) markDot()
  }, [uncovering])

  useEffect(() => {
    introPlayed = true
  }, [])

  return (
    <main className="grid min-h-dvh grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-8 overflow-x-clip p-4 sm:gap-x-8 sm:p-8 lg:h-dvh lg:min-h-[38rem] lg:grid-rows-[minmax(0,1fr)_auto] lg:gap-y-4 lg:pr-12">
      {/* The bass rises out of the bottom of its column, sinks back when a page opens, and
          rises again when you come back.
          On large screens it's as tall as the screen allows (less room for the buttons under
          it), so the column is 0.3 of that: the photo's width-to-height ratio. */}
      <div className="relative w-[min(34vw,24dvh)] lg:row-span-2 lg:w-[calc((max(100dvh,38rem)-10rem)*0.3)]">
        <div className="size-full overflow-clip">
          <motion.div
            initial={entrance === 'none' ? false : { y: '102%' }}
            animate={{ y: hidden ? '102%' : '0%' }}
            transition={
              leaving
                ? { delay: 0.2, duration: 0.7, ease: [0.55, 0.055, 0.675, 0.19] }
                : { delay: intro ? 0.2 : 0.1, duration: intro ? 1.4 : 1, ease }
            }
            className="h-full"
          >
            <BassGuitar className="h-full" />
          </motion.div>
        </div>

        {/* Cartoon speech bubble by the neck: a hard offset shadow plus a soft one behind it
            lift it off the background. It sits outside the clipping box so it can overhang. */}
        <motion.div
          initial={fromBloom ? false : { opacity: 0, scale: 0.6, rotate: -8 }}
          animate={{ opacity: hidden ? 0 : 1, scale: hidden ? 0.6 : 1, rotate: -3 }}
          transition={{
            // The entrance delay only applies on the way in; after that the bubble settles back
            // quickly (a stiffer spring, no delay) when the pointer leaves it
            delay: hidden || bubbleSettled ? 0 : intro ? 1.6 : 0.5,
            type: 'spring',
            stiffness: 520,
            damping: 20,
          }}
          whileHover={{
            scale: 1.18,
            rotate: 2,
            x: 6,
            y: -8,
            transition: { type: 'spring', stiffness: 500, damping: 9 },
          }}
          whileTap={{ scale: 0.94, x: 0, y: 0 }}
          style={{ transformOrigin: '0% 70%' }}
          className="group absolute top-[7%] left-[78%] z-10 w-max cursor-default select-none"
        >
          <p className="relative rounded-[1.4rem] border-[3px] border-black bg-[#fff3cf] px-4 py-2.5 font-display text-sm leading-tight font-extrabold text-black [font-stretch:115%] shadow-[6px_6px_0_rgb(0_0_0/0.85),0_14px_26px_rgb(0_0_0/0.55)] transition-shadow duration-150 group-hover:shadow-[11px_11px_0_rgb(0_0_0/0.85),0_26px_38px_rgb(0_0_0/0.6)] sm:text-base">
            Play me.
            <br />I make sound!
            {/* Tail pointing back at the neck: black outline triangle under a cream one */}
            <span
              aria-hidden
              className="absolute top-1/2 -left-[17px] -mt-2 size-0 border-y-[9px] border-r-[17px] border-y-transparent border-r-black"
            />
            <span
              aria-hidden
              className="absolute top-1/2 -left-[11px] -mt-[5px] size-0 border-y-[6px] border-r-[12px] border-y-transparent border-r-[#fff3cf]"
            />
          </p>
        </motion.div>
      </div>

      <WarpedMenu
        entrance={entrance}
        className="min-h-0"
        below={
          // Under the menu: opens what's set at /admin → Currently working, with a dot that
          // swells into the page. Halfway between the last word and the introduction below (the
          // translate is half the gap between the rows), and a little left of the words' edge.
          work && (
            <motion.div
              initial={fromBloom ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: hidden ? 0 : 1, y: hidden ? 12 : 0 }}
              transition={{
                delay: hidden || bubbleSettled ? 0 : intro ? 2 : 0.8,
                duration: 0.7,
                ease,
              }}
              className="row-start-3 mr-[7vw] flex translate-y-4 items-center justify-end lg:translate-y-2"
            >
              {/* The same type as the page titles and the menu words, small, in an outlined pill.
                  Every few seconds it hops, with a ring spreading out from it and the dot
                  flaring, to show it can be clicked. */}
              <PageLink
                to={CURRENT_PROJECT_PATH}
                onClick={startBloom}
                style={{ animationDelay: `${flourishAt}s, ${flourishAt}s` }}
                className="relative flex animate-[cta-hop_8s_ease-out_infinite,cta-ring_8s_ease-out_infinite] items-center gap-[0.55em] rounded-full border-[1.5px] border-accent px-[0.9em] py-[0.65em] font-display text-[0.68rem] leading-none font-black tracking-[0.01em] text-accent uppercase [font-stretch:125%] [-webkit-text-stroke:max(0.5px,0.02em)_var(--color-accent)] after:absolute after:-inset-2.5 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent active:scale-[0.97] motion-reduce:animate-none sm:text-[clamp(0.8rem,1.4vw,1.05rem)]"
              >
                <span
                  ref={dot}
                  aria-hidden="true"
                  style={{ animationDelay: `0s, ${flourishAt}s` }}
                  className="size-[0.45em] shrink-0 animate-[dot-pulse_1.6s_ease-in-out_infinite,cta-flare_8s_ease-out_infinite] rounded-full bg-accent motion-reduce:animate-none"
                />
                {/* Two lines on phones, where the column is narrow */}
                <span className="whitespace-nowrap max-sm:leading-[1.15]">
                  Currently <span className="max-sm:block">Working On</span>
                </span>
              </PageLink>
            </motion.div>
          )
        }
      />

      <motion.div
        initial={entrance === 'return' ? { opacity: 0 } : false}
        animate={{ opacity: hidden ? 0 : 1 }}
        transition={leaving ? { duration: 0.3 } : { delay: 0.3, duration: 0.6 }}
        className="col-span-2 flex flex-col gap-6 lg:col-span-1 lg:col-start-2 lg:flex-row lg:items-end lg:justify-between lg:gap-12"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-12">
          {/* Each word slides up out of its own line, like a title card */}
          <h1 className="max-w-[9em] font-display text-[2.5rem] leading-[0.95] font-bold tracking-[-0.01em] uppercase [font-stretch:125%] sm:text-5xl lg:text-[2.75rem]">
            {hero.heading.split(' ').map((part, i) => (
              <span
                key={`${part}-${i}`}
                className="inline-block overflow-clip pb-[0.08em] align-top"
              >
                <motion.span
                  initial={intro ? { y: '110%' } : false}
                  animate={{ y: '0%' }}
                  transition={{ delay: 0.5 + i * 0.12, duration: 1, ease }}
                  className="inline-block"
                >
                  {part}
                  {' '}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={intro ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease }}
            className="max-w-sm text-sm"
          >
            {hero.eyebrow && <p className="text-muted">{hero.eyebrow}</p>}
            {hero.intro && <p className="mt-2 text-pretty">{hero.intro}</p>}
          </motion.div>
        </div>

        <motion.div
          initial={intro ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8, ease }}
        >
          <ul className="flex gap-2">
            <li>
              <a href={`mailto:${profile.email}`} aria-label="Email me" className={iconLink}>
                <MailIcon />
              </a>
            </li>
            {profile.links.linkedin && (
              <li>
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile"
                  className={iconLink}
                >
                  <LinkedInIcon />
                </a>
              </li>
            )}
            {profile.links.github && (
              <li>
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profile"
                  className={iconLink}
                >
                  <GitHubIcon />
                </a>
              </li>
            )}
          </ul>
        </motion.div>
      </motion.div>

      {/* The swelling dot: a circle of the accent color, centered on the dot, that grows until
          it covers the screen. Then the page changes and the new page fades in from it. */}
      {uncovering && (
        <div
          aria-hidden="true"
          onAnimationEnd={() => setUncovering(false)}
          className="pointer-events-none fixed inset-0 z-50 animate-[bloom-uncover_0.75s_cubic-bezier(0.65,0,0.35,1)_0.45s_both] bg-accent"
        />
      )}
      {bloom && leavingTo === CURRENT_PROJECT_PATH && (
        <motion.div
          aria-hidden="true"
          initial={{ scale: bloom.from }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.65, ease: [0.65, 0, 0.35, 1] }}
          style={{
            left: bloom.x - bloom.radius,
            top: bloom.y - bloom.radius,
            width: bloom.radius * 2,
            height: bloom.radius * 2,
          }}
          className="pointer-events-none fixed z-50 rounded-full bg-accent"
        />
      )}
    </main>
  )
}

/** Links to the old one-page site (/#projects and so on) open the matching page instead. */
function useOldSectionLinks() {
  const { hash } = useLocation()
  const navigate = useNavigate()
  const pages = usePages()

  useEffect(() => {
    const page = pages.find((item) => `#${item.id}` === hash)
    if (page) navigate(page.to, { replace: true })
  }, [hash, pages, navigate])
}
