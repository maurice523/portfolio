import { useContent } from '@/content/context'
import { ExperienceItem } from './ExperienceItem'

export function ExperienceSection() {
  const { experience } = useContent()

  return (
    <ol className="flex flex-col">
      {experience.map((item) => (
        <ExperienceItem key={`${item.company}-${item.role}`} item={item} />
      ))}
    </ol>
  )
}
