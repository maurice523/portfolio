import { profile } from '@/data/profile'
import { Section } from './Section'

export function AboutSection() {
  const { about, education, languages, location } = profile

  return (
    <Section id="about" title="About me" eyebrow={`${location} · Bentley ’27`}>
      <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
        <div className="flex max-w-prose flex-col gap-3 text-muted lg:col-span-3">
          {about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="text-sm">
            <span className="font-medium text-fg">Languages:</span> {languages.join(' · ')}
          </p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-4 text-sm md:p-5 lg:col-span-2">
          <h3 className="text-sm font-medium text-muted">Education</h3>
          <p className="mt-1.5 text-base font-semibold">{education.school}</p>
          <p className="mt-1 text-muted">{education.degree}</p>
          <p className="mt-1 font-mono text-sm text-muted">{education.date}</p>
          <ul className="mt-3 flex flex-col gap-1.5 border-t border-line pt-3">
            {education.details.map((detail) => (
              <li key={detail} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
