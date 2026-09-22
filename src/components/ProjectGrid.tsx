import clsx from 'clsx'
import type { Project } from '@/types/project'
import { ProjectCard } from './ProjectCard'

// Phones: 1 column. Tablets: 2 columns.
// Desktops: a 6-column grid where featured projects take half the row (span 3)
// and the rest take a third (span 2), so 2 featured + 3 others fill two neat rows.
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
      {projects.map((project) => (
        <li
          key={project.slug}
          className={clsx(project.featured ? 'lg:col-span-3' : 'lg:col-span-2')}
        >
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  )
}
