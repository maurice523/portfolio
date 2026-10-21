import clsx from 'clsx'
import { motion } from 'motion/react'
import { useRef } from 'react'
import type { Project } from '@/shared/schema'
import { ExternalLinkIcon, GitHubIcon } from './icons'
import { PageLink } from './PageTransition'
import { usePageExit, useSurroundings } from './pageExit'
import { ProjectPreview } from './ProjectPreview'
import { StatusBadge } from './StatusBadge'
import { ToolChip } from './ToolChip'
import { useTightWidth } from './useTightWidth'

// One project row, the same size for every project: preview on the left, details on the right.
// On phones it's compact: a small preview beside the status and title, the rest underneath.
// The whole row links to the project page; the GitHub / live icons sit on top and open in a
// new tab.
// Opening a project, its title and image float to their places on the project page while the
// rest of the list makes way; coming back, they float back into the row (see PageTransition.tsx).
export function ProjectCard({ project }: { project: Project }) {
  const { slug, title, tagline, tools, links, date, status } = project
  const path = `/projects/${slug}`
  const { leavingTo, arrivedFrom, landing } = usePageExit()
  const travels = leavingTo === path || (arrivedFrom === path && landing)
  const fade = useSurroundings()
  const stay = useSurroundings(travels)
  const titleBox = useRef<HTMLSpanElement>(null)
  useTightWidth(titleBox, title)

  return (
    <article
      // Where the projects page scrolls to when you come back from this project
      data-card-for={path}
      className="group relative grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-4 gap-y-3 py-6 md:grid-cols-2 md:items-center md:gap-10 md:py-8"
    >
      <motion.div
        {...stay}
        style={{ viewTransitionName: travels ? 'project-image' : undefined }}
        className="max-md:row-span-2 max-md:self-start"
      >
        <ProjectPreview
          project={project}
          className="aspect-[2/1] overflow-hidden rounded-lg border border-line"
        />
      </motion.div>

      {/* On phones its parts join the row's grid, so some can run under the preview */}
      <div className="max-md:contents md:flex md:flex-col md:gap-3">
        <motion.div
          {...fade}
          className="flex flex-wrap items-center justify-between gap-x-4 gap-y-0.5 max-md:flex-col max-md:items-start"
        >
          <StatusBadge status={status} />
          <span className="text-sm text-muted tabular-nums max-md:text-xs">{date}</span>
        </motion.div>

        <motion.h3
          {...stay}
          className="text-xl leading-none font-extrabold tracking-[-0.015em] [font-stretch:112%] sm:text-3xl md:text-4xl"
        >
          {/* The box that floats to the project page's title: one inline-block, as wide as its
              longest line. Plain wrapping (not balanced), so its lines break in the same places
              as the page title's. */}
          <span
            ref={titleBox}
            style={{ viewTransitionName: travels ? 'project-title' : undefined }}
            className="inline-block text-wrap"
          >
            {/* The ::after makes this link cover the whole row */}
            <PageLink
              to={path}
              className={clsx(
                "decoration-accent decoration-2 underline-offset-4 after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:outline-2 focus-visible:after:outline-accent",
                !travels && 'group-hover:underline',
              )}
            >
              {title}
            </PageLink>
          </span>
        </motion.h3>
        <motion.p {...fade} className="max-w-prose text-muted max-md:col-span-2 max-md:text-sm">
          {tagline}
        </motion.p>

        <motion.ul
          {...fade}
          className="flex flex-wrap gap-1.5 max-md:col-span-2"
          aria-label="Tools used"
        >
          {tools.map((tool) => (
            <ToolChip key={tool} name={tool} />
          ))}
        </motion.ul>

        {(links.github || links.live) && (
          <motion.div
            {...fade}
            className="relative z-10 -my-2 -ml-3 flex gap-1 max-md:col-span-2 md:my-0"
          >
            {links.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${title} on GitHub`}
                className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:text-fg"
              >
                <GitHubIcon />
              </a>
            )}
            {links.live && (
              <a
                href={links.live}
                target="_blank"
                rel="noreferrer"
                aria-label={`${title} live site`}
                className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:text-fg"
              >
                <ExternalLinkIcon />
              </a>
            )}
          </motion.div>
        )}
      </div>
    </article>
  )
}
