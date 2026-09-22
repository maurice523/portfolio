import { profile } from '@/data/profile'
import { GitHubIcon, LinkedInIcon, MailIcon } from './icons'
import { Section } from './Section'

const secondaryButton =
  'inline-flex min-h-11 items-center gap-2 rounded-lg border border-line px-4 font-medium hover:border-muted'

export function ContactSection() {
  const { email, links } = profile

  return (
    <Section
      id="contact"
      title="Get in touch"
      intro="Whether it’s an internship, a project idea or just a question about my work, my inbox is open."
    >
      <div className="flex flex-wrap gap-3">
        <a
          href={`mailto:${email}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 font-medium text-bg hover:bg-accent/90"
        >
          <MailIcon className="size-4" /> {email}
        </a>
        {links.linkedin && (
          <a href={links.linkedin} target="_blank" rel="noreferrer" className={secondaryButton}>
            <LinkedInIcon className="size-4" /> LinkedIn
          </a>
        )}
        {links.github && (
          <a href={links.github} target="_blank" rel="noreferrer" className={secondaryButton}>
            <GitHubIcon className="size-4" /> GitHub
          </a>
        )}
        {links.resume && (
          <a href={links.resume} target="_blank" rel="noreferrer" className={secondaryButton}>
            Download resume
          </a>
        )}
      </div>
    </Section>
  )
}
