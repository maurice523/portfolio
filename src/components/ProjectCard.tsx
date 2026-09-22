import { Link } from 'react-router'
import type { Project } from '@/types/project'
import { ExternalLinkIcon, GitHubIcon } from './icons'
import { StatusBadge } from './StatusBadge'
import { ToolChip } from './ToolChip'

// One project in the grid. The whole card links to the project page;
// the GitHub / live icons sit on top and open in a new tab.
export function ProjectCard({ project }: { project: Project }) {
  const { slug, title, tagline, image, imageAlt, tools, links, date, status } = project

  return (
    <article className="group border-line bg-surface hover:border-accent/50 relative flex h-full flex-col overflow-hidden rounded-xl border transition duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <img
        src={image}
        alt={imageAlt}
        loading="lazy"
        decoding="async"
        className="aspect-video w-full max-w-full object-cover"
      />

      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <StatusBadge status={status} />
          <span className="text-muted font-mono text-sm tabular-nums">{date}</span>
        </div>

        <div>
          <h3 className="text-xl font-semibold tracking-tight">
            {/* The ::after makes this link cover the whole card */}
            <Link
              to={`/projects/${slug}`}
              className="group-hover:text-accent focus-visible:after:outline-accent after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-xl focus-visible:after:outline-2"
            >
              {title}
            </Link>
          </h3>
          <p className="text-muted mt-2">{tagline}</p>
        </div>

        <ul className="flex flex-wrap gap-2" aria-label="Tools used">
          {tools.map((tool) => (
            <ToolChip key={tool} name={tool} />
          ))}
        </ul>

        <div className="border-line mt-auto flex items-center justify-between border-t pt-4">
          <span className="text-accent font-medium" aria-hidden="true">
            View details →
          </span>
          <div className="relative z-10 -my-2 flex gap-1">
            {links.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${title} on GitHub`}
                className="text-muted hover:text-fg grid size-11 place-items-center rounded-md"
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
                className="text-muted hover:text-fg grid size-11 place-items-center rounded-md"
              >
                <ExternalLinkIcon />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
