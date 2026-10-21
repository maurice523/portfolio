import clsx from 'clsx'
import { motion } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { Container } from './Container'
import { Footer } from './Footer'
import { ArrowLeftIcon } from './icons'
import { PageLink } from './PageTransition'
import { usePageExit, useSurroundings } from './pageExit'
import { useTightWidth } from './useTightWidth'

type PageFrameProps = {
  title: string
  intro?: ReactNode
  /**
   * "section": the title is a home menu word, which floats between the home page and here.
   * "project": the title floats (with the project's image) between its row on the projects
   * page and here, and the back arrow leads to the projects page.
   */
  kind?: 'section' | 'project'
  /** False when the content holds travellers of its own and fades its other parts itself. */
  fadeContent?: boolean
  children: ReactNode
}

// Everything except the home page: a back arrow, a giant title and the page's content.
// Pages don't link to each other: the arrow leads home, where the menu is, so every move between
// pages goes through the home page's transition. Project pages lead back to the projects page.
export function PageFrame({
  title,
  intro,
  kind = 'section',
  fadeContent = true,
  children,
}: PageFrameProps) {
  const back =
    kind === 'project'
      ? { to: '/projects', label: 'Back to projects' }
      : { to: '/', label: 'Back to home' }
  const { leavingTo, arrivedFrom, landing } = usePageExit()
  // The title travels to the page the back arrow leads to, and back from it (see
  // PageTransition.tsx). Everything else makes way for it.
  const titleTravels = leavingTo === back.to || (arrivedFrom === back.to && landing)
  const surroundings = useSurroundings()
  const titleMotion = useSurroundings(titleTravels)
  const titleBox = useRef<HTMLSpanElement>(null)
  useTightWidth(titleBox, title)

  return (
    <div className="flex min-h-dvh flex-col">
      <motion.header {...surroundings} className="py-4 sm:py-6">
        <Container>
          <div className="flex">
            <PageLink
              to={back.to}
              aria-label={back.label}
              title={back.label}
              className="group -ml-3 grid size-12 place-items-center rounded-full transition-colors hover:text-accent"
            >
              <ArrowLeftIcon className="size-7 transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none" />
            </PageLink>
          </div>
        </Container>
      </motion.header>

      <main className="flex-1">
        <Container>
          <div className="pt-8 pb-10 md:pt-14 md:pb-14">
            <motion.h1
              {...titleMotion}
              // Each in the same type as where it travels from, so the morph is seamless: the
              // home menu words (stroke included), or the project titles on the projects page
              className={clsx(
                'font-display break-words',
                kind === 'section'
                  ? 'text-[clamp(2.25rem,9.4vw,6.5rem)] leading-[0.92] font-black tracking-[0.01em] text-accent uppercase [font-stretch:125%] [-webkit-text-stroke:max(1px,0.02em)_var(--color-accent)]'
                  : // Plain wrapping, like the project rows, so the lines break in the same places
                    'text-[clamp(2.5rem,7vw,5rem)] leading-none font-extrabold tracking-[-0.015em] text-wrap [font-stretch:112%]',
              )}
            >
              {/* The box that travels: one inline-block, as wide as its longest line */}
              <span
                ref={titleBox}
                style={{
                  viewTransitionName: titleTravels
                    ? kind === 'section'
                      ? 'page-title'
                      : 'project-title'
                    : undefined,
                }}
                className="inline-block"
              >
                {title}
              </span>
            </motion.h1>
            {intro && (
              <motion.div
                {...surroundings}
                className="mt-5 max-w-2xl text-lg text-pretty text-muted"
              >
                {intro}
              </motion.div>
            )}
          </div>
        </Container>

        {fadeContent ? (
          <motion.div {...surroundings} className="pb-16 md:pb-24">
            <Container>{children}</Container>
          </motion.div>
        ) : (
          <div className="pb-16 md:pb-24">
            <Container>{children}</Container>
          </div>
        )}
      </main>

      <motion.div {...surroundings}>
        <Footer />
      </motion.div>
    </div>
  )
}
