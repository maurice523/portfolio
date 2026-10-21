import { useContent } from '@/content/context'
import { ExperienceItem } from './ExperienceItem'
import { Section } from './Section'

export function ExperienceSection() {
  const { experience, settings } = useContent()
  const copy = settings.sections.experience

  return (
    <Section id="experience" title={copy.title} intro={copy.intro}>
      <ol className="flex flex-col">
        {experience.map((item) => (
          <ExperienceItem key={`${item.company}-${item.role}`} item={item} />
        ))}
      </ol>
    </Section>
  )
}
