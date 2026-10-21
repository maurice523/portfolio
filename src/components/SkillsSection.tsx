import { useContent } from '@/content/context'
import { SectionHeading } from './SectionHeading'
import { ToolChip } from './ToolChip'

export function SkillsSection() {
  const { skills, sections } = useContent().settings
  const { groups } = skills

  return (
    <section className="mt-20 md:mt-28">
      <SectionHeading title={sections.skills.title} intro={sections.skills.intro} />
      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.name} className="border-t border-line pt-4">
            <h3 className="font-sans text-sm font-medium text-muted">{group.name}</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {group.items.map((skill) => (
                <ToolChip key={skill} name={skill} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
