import { Link, useParams } from 'react-router'
import { Container } from '@/components/Container'
import { ExternalLinkIcon, GitHubIcon } from '@/components/icons'
import { ProjectPreview } from '@/components/ProjectPreview'
import { StatusBadge } from '@/components/StatusBadge'
import { ToolChip } from '@/components/ToolChip'
import { getProjectBySlug } from '@/data/projects'
import { profile } from '@/data/profile'
import { NotFoundPage } from './NotFoundPage'

export function ProjectPage() {
  const { slug = '' } = useParams()
  const project = getProjectBySlug(slug)

  if (!project) return <NotFoundPage />

  const { title, tagline, description, highlights, tools, links, date, status } = project

  return (
    <main>
      <title>{`${title} | ${profile.name}`}</title>
      <meta name="description" content={tagline} />

      <Container>
        <article className="py-6 md:py-10">
          <Link
            to="/#projects"
            className="-ml-1 inline-flex min-h-11 items-center px-1 text-sm font-medium text-muted hover:text-fg"
          >
            ← All projects
          </Link>

          <header className="mt-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <StatusBadge status={status} />
              <span className="font-mono text-sm text-muted tabular-nums">{date}</span>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
            <p className="mt-3 text-lg text-muted">{tagline}</p>

            {(links.github || links.live) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {links.live && (
                  <a
                    href={links.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-medium text-bg hover:bg-accent/90"
                  >
                    <ExternalLinkIcon className="size-4" /> Visit live site
                  </a>
                )}
                {links.github && (
                  <a
                    href={links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 font-medium hover:border-muted"
                  >
                    <GitHubIcon className="size-4" /> View code
                  </a>
                )}
              </div>
            )}
          </header>

          <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              <ProjectPreview
                project={project}
                className="aspect-[2/1] rounded-xl border border-line"
              />
              <h2 className="mt-8 text-xl font-semibold tracking-tight">About the project</h2>
              <p className="mt-3 text-muted">{description}</p>

              {highlights && highlights.length > 0 && (
                <>
                  <h2 className="mt-8 text-xl font-semibold tracking-tight">Highlights</h2>
                  <ul className="mt-4 flex flex-col gap-3">
                    {highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3 text-muted">
                        <span
                          aria-hidden="true"
                          className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent"
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <aside>
              <h2 className="text-sm font-medium text-muted">Tools used</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <ToolChip key={tool} name={tool} />
                ))}
              </ul>
            </aside>
          </div>
        </article>
      </Container>
    </main>
  )
}
