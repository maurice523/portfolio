import type { Project } from '@/shared/schema'
import { ProjectCard } from './ProjectCard'

// One project per row, separated by rules, in the order from /admin (featured first).
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="border-b border-line">
      {projects.map((project) => (
        <li key={project.slug} className="border-t border-line">
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  )
}
