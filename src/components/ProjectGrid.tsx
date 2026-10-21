import { motion } from 'motion/react'
import type { Project } from '@/shared/schema'
import { useSurroundings } from './pageExit'
import { ProjectCard } from './ProjectCard'

// One project per row, separated by rules, in the order from /admin (featured first).
// The rules are their own elements so they can fade away with the rest of the list while a
// project's title and image travel to its page.
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const fade = useSurroundings()
  const rule = <motion.div {...fade} aria-hidden="true" className="h-px bg-line" />

  return (
    <div>
      <ul>
        {projects.map((project) => (
          <li key={project.slug}>
            {rule}
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
      {rule}
    </div>
  )
}
