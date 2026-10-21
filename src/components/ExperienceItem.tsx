import type { Experience } from '@/shared/schema'

// One job in the Experience timeline. On desktop the date sits in its own column,
// left of the line; on phones it goes above the role.
export function ExperienceItem({ item }: { item: Experience }) {
  return (
    <li className="group grid gap-x-10 md:grid-cols-[11rem_1fr]">
      <p className="pt-1 text-sm text-muted tabular-nums md:text-right">{item.date}</p>

      <div className="relative border-l border-line pb-12 pl-8 group-last:pb-0 max-md:mt-2">
        {/* Dot on the timeline line */}
        <span
          aria-hidden="true"
          className="absolute top-2 left-0 size-3 -translate-x-[6.5px] rounded-full border-2 border-accent bg-bg"
        />
        <h3 className="text-2xl leading-tight font-semibold tracking-tight [font-stretch:88%]">
          {item.role}
        </h3>
        <p className="mt-1 font-medium text-accent">{item.company}</p>
        <ul className="mt-4 flex max-w-prose flex-col gap-2 text-muted">
          {item.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 size-1 shrink-0 rounded-full bg-muted" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}
