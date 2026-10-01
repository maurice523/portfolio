import { useContent } from '@/content/context'
import { ExperienceItem } from './ExperienceItem'
import { Section } from './Section'

export function ExperienceSection() {
  const { experience, settings } = useContent()
  const copy = settings.sections.experience

  return (
    <Section
      id="experience"
      title={copy.title}
      intro={copy.intro}
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
