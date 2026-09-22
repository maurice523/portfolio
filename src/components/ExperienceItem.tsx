import type { Experience } from '@/data/profile'

// One job in the Experience timeline.
export function ExperienceItem({ item }: { item: Experience }) {
  return (
    <li className="relative pl-8">
      {/* Dot on the timeline line */}
      <span
        aria-hidden="true"
        className="absolute top-1.5 left-0 size-3 -translate-x-[6.5px] rounded-full border-2 border-accent bg-bg"
      />
      <div className="flex flex-col gap-x-4 gap-y-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className="text-base font-semibold tracking-tight md:text-lg">
          {item.role} <span className="text-muted">· {item.company}</span>
        </h3>
        <span className="shrink-0 font-mono text-sm text-muted tabular-nums">{item.date}</span>
      </div>
      <ul className="mt-2 flex max-w-prose flex-col gap-1.5 text-[0.9375rem] text-muted">
        {item.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3">
            <span aria-hidden="true" className="mt-2.5 size-1 shrink-0 rounded-full bg-muted" />
            {bullet}
          </li>
        ))}
      </ul>
    </li>
  )
}
