import { useContent } from '@/content/context'
import { Section } from './Section'
import { ToolChip } from './ToolChip'

export function SkillsSection() {
  const { skills, sections } = useContent().settings
  const { groups } = skills
  const total = groups.reduce((sum, group) => sum + group.items.length, 0)

  return (
    <Section
      id="skills"
      title={sections.skills.title}
      intro={sections.skills.intro}
      eyebrow={`${total} tools & technologies`}
    >
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.name}>
            <h3 className="text-sm font-medium text-muted">{group.name}</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {group.items.map((skill) => (
                <ToolChip key={skill} name={skill} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
