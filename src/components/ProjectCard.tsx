import clsx from 'clsx'
import { Link } from 'react-router'
import type { Project } from '@/shared/schema'
import { ExternalLinkIcon, GitHubIcon } from './icons'
import { ProjectPreview } from './ProjectPreview'
import { StatusBadge } from './StatusBadge'
import { ToolChip } from './ToolChip'

// One project row: preview on the left, details on the right. Featured projects get a larger
// preview. The whole row links to the project page; the GitHub / live icons sit on top and
// open in a new tab.
export function ProjectCard({ project }: { project: Project }) {
  const { slug, title, tagline, tools, links, date, status, featured } = project

  return (
    <article
      className={clsx(
        'group relative grid gap-6 py-8 md:items-center md:gap-10',
        featured ? 'md:grid-cols-[7fr_5fr]' : 'md:grid-cols-[5fr_7fr]',
      )}
    >
      <ProjectPreview
        project={project}
        className="aspect-[2/1] overflow-hidden rounded-lg border border-line"
      />

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <StatusBadge status={status} />
          <span className="text-sm text-muted tabular-nums">{date}</span>
        </div>

        <h3 className="text-3xl leading-none font-bold tracking-[-0.02em] [font-stretch:85%] md:text-4xl">
          {/* The ::after makes this link cover the whole row */}
          <Link
            to={`/projects/${slug}`}
            className="decoration-accent decoration-2 underline-offset-4 group-hover:underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:outline-2 focus-visible:after:outline-accent"
          >
            {title}
          </Link>
        </h3>
        <p className="max-w-prose text-muted">{tagline}</p>

        <ul className="flex flex-wrap gap-1.5" aria-label="Tools used">
          {tools.map((tool) => (
            <ToolChip key={tool} name={tool} />
          ))}
        </ul>

        {(links.github || links.live) && (
          <div className="relative z-10 -ml-3 flex gap-1">
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
          </div>
        )}
      </div>
    </article>
  )
}
