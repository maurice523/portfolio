import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { BassGuitar } from '@/components/BassGuitar'
import { GitHubIcon, LinkedInIcon, MailIcon } from '@/components/icons'
import { usePageExit } from '@/components/pageExit'
import { WarpedMenu, type MenuEntrance } from '@/components/WarpedMenu'
import { useContent } from '@/content/context'
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
  const leaving = leavingTo !== null
  const [entrance] = useState<MenuEntrance>(() => {
    if (arrivedFrom) return 'return'
    return introPlayed ? 'none' : 'intro'
  })
  const intro = entrance === 'intro'
  // Back from a page: the bass and the text wait out of sight until its title has landed
  const waiting = entrance === 'return' && landing
  const hidden = leaving || waiting
  useOldSectionLinks()

  useEffect(() => {
    introPlayed = true
  }, [])

  return (
    <main className="grid min-h-dvh grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-8 overflow-x-clip p-4 sm:gap-x-8 sm:p-8 lg:h-dvh lg:min-h-[38rem] lg:grid-rows-[minmax(0,1fr)_auto] lg:gap-y-4 lg:pr-12">
      {/* The bass rises out of the bottom of its column, sinks back when a page opens, and
          rises again when you come back.
          On large screens it's as tall as the screen allows (less room for the buttons under
          it), so the column is 0.3 of that: the photo's width-to-height ratio. */}
      <div className="w-[min(34vw,24dvh)] overflow-clip lg:row-span-2 lg:w-[calc((max(100dvh,38rem)-10rem)*0.3)]">
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

      <WarpedMenu entrance={entrance} className="min-h-0" />

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
