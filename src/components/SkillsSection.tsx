import { profile } from '@/data/profile'
import { Section } from './Section'
import { ToolChip } from './ToolChip'

export function SkillsSection() {
  const groups = Object.entries(profile.skills)
  const total = groups.reduce((sum, [, skills]) => sum + skills.length, 0)

  return (
    <Section id="skills" title="Skills" eyebrow={`${total} tools & technologies`}>
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map(([group, skills]) => (
          <div key={group}>
            <h3 className="text-sm font-medium text-muted">{group}</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <ToolChip key={skill} name={skill} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
