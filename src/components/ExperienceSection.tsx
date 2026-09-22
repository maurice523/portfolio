import { profile } from '@/data/profile'
import { ExperienceItem } from './ExperienceItem'
import { Section } from './Section'

export function ExperienceSection() {
  const { experience } = profile

  return (
    <Section
      id="experience"
      title="Experience"
      eyebrow={`${experience.length} roles · newest first`}
    >
      <ol className="flex flex-col gap-8 border-l border-line">
        {experience.map((item) => (
          <ExperienceItem key={`${item.company}-${item.role}`} item={item} />
        ))}
      </ol>
    </Section>
  )
}
