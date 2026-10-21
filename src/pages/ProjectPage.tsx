import { motion } from 'motion/react'
import { useParams } from 'react-router'
import { ExternalLinkIcon, GitHubIcon } from '@/components/icons'
import { PageFrame } from '@/components/PageFrame'
import { usePageExit, useSurroundings } from '@/components/pageExit'
import { ProjectPreview } from '@/components/ProjectPreview'
import { StatusBadge } from '@/components/StatusBadge'
import { ToolChip } from '@/components/ToolChip'
import { useContent } from '@/content/context'
import { NotFoundPage } from './NotFoundPage'

export function ProjectPage() {
  const { slug = '' } = useParams()
  const { projects, settings } = useContent()
  const { profile } = settings
  const project = projects.find((item) => item.slug === slug)
  const { leavingTo, arrivedFrom, landing } = usePageExit()
  // The image floats here from the project's row on the projects page, and back to it, along
  // with the title (see PageFrame); the rest makes way
  const imageTravels = leavingTo === '/projects' || (arrivedFrom === '/projects' && landing)
  const fade = useSurroundings()
  const stay = useSurroundings(imageTravels)

  if (!project) return <NotFoundPage />

  const { title, tagline, description, highlights, tools, links, date, status } = project

  return (
    <PageFrame title={title} intro={tagline} kind="project" fadeContent={false}>
      <title>{`${title} | ${profile.name}`}</title>
      <meta name="description" content={tagline} />

      <article>
        <motion.div
          {...fade}
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-line pt-5"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <StatusBadge status={status} />
            <span className="text-sm text-muted tabular-nums">{date}</span>
          </div>

          {(links.github || links.live) && (
            <div className="flex flex-wrap gap-3">
              {links.live && (
                <a
                  href={links.live}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-medium text-bg transition-colors hover:bg-fg"
                >
                  <ExternalLinkIcon className="size-4" /> Visit live site
                </a>
              )}
              {links.github && (
                <a
                  href={links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-medium transition-colors hover:border-fg"
                >
                  <GitHubIcon className="size-4" /> View code
                </a>
              )}
            </div>
          )}
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <motion.div
              {...stay}
              style={{ viewTransitionName: imageTravels ? 'project-image' : undefined }}
            >
              <ProjectPreview
                project={project}
                className="aspect-[2/1] rounded-xl border border-line"
              />
            </motion.div>
            <motion.div {...fade}>
              <h2 className="mt-10 text-xl font-extrabold [font-stretch:112%]">
                About the project
              </h2>
              {description.split('\n\n').map((paragraph) => (
                <p key={paragraph} className="mt-3 text-muted">
                  {paragraph}
                </p>
              ))}

              {highlights.length > 0 && (
                <>
                  <h2 className="mt-10 text-xl font-extrabold [font-stretch:112%]">Highlights</h2>
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
            </motion.div>
          </div>

          <motion.aside {...fade}>
            <h2 className="text-sm font-medium text-muted">Tools used</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {tools.map((tool) => (
                <ToolChip key={tool} name={tool} />
              ))}
            </ul>
          </motion.aside>
        </div>
      </article>
    </PageFrame>
  )
}
