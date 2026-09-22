import clsx from 'clsx'
import type { ProjectStatus } from '@/types/project'

const labels: Record<ProjectStatus, string> = {
  live: 'Live',
  'in-development': 'In development',
  completed: 'Completed',
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 text-sm font-medium',
        status === 'live' && 'text-accent',
        status === 'in-development' && 'text-amber',
        status === 'completed' && 'text-muted',
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          'size-2 rounded-full bg-current',
          status === 'in-development' && 'animate-pulse motion-reduce:animate-none',
        )}
      />
      {labels[status]}
    </span>
  )
}
