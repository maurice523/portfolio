import { motion } from 'motion/react'
import type { Project } from '@/shared/schema'
import { useSurroundings } from './pageExit'
import { ProjectCard } from './ProjectCard'

/**
 * Groups projects by their heading. Headings come in the order they first appear in the project
 * list, and each project keeps its place within its heading. Projects with no heading make up a
 * group of their own, shown without one.
 */
function groupBySection(projects: Project[]) {
  const groups = new Map<string, Project[]>()
  for (const project of projects) {
    const group = groups.get(project.section)
    if (group) group.push(project)
    else groups.set(project.section, [project])
  }
  return [...groups].map(([section, items]) => ({ section, projects: items }))
}

// Projects under their headings (e.g. Machine learning, Data analysis), one per row, separated by
// rules, in the order set in /admin.
// The rules and headings are their own elements so they can fade away with the rest of the list
// while a project's title and image travel to its page.
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const fade = useSurroundings()
  const rule = <motion.div {...fade} aria-hidden="true" className="h-px bg-line" />

  return (
    <div className="flex flex-col gap-14 md:gap-20">
      {groupBySection(projects).map(({ section, projects: items }) => (
        <section key={section} aria-label={section || 'Projects'}>
          {section && (
            <motion.h2
              {...fade}
              className="mb-4 text-2xl leading-none font-black tracking-[0.01em] uppercase [font-stretch:125%] md:mb-6 md:text-3xl"
            >
              {section}
            </motion.h2>
          )}
          <ul>
            {items.map((project) => (
              <li key={project.slug}>
                {rule}
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
          {rule}
        </section>
      ))}
    </div>
  )
}
