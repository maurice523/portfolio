import { useEffect, useState } from 'react'
import { useContent } from '@/content/context'
import { GitHubIcon, LinkedInIcon } from './icons'
import { Section } from './Section'

const secondaryButton =
  'inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 font-medium transition-colors hover:border-fg'

export function ContactSection() {
  const { profile, sections } = useContent().settings
  const { email, links } = profile
  const [copied, setCopied] = useState(false)

  // Put the button label back a moment after copying
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
    } catch {
      // Clipboard blocked (e.g. insecure context): the mailto link still works
    }
  }

  return (
    <Section id="contact" title={sections.contact.title} intro={sections.contact.intro}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <a
            href={`mailto:${email}`}
            className="font-display text-3xl leading-none font-semibold tracking-[-0.03em] break-all [font-stretch:82%] decoration-accent decoration-2 underline-offset-8 hover:text-accent hover:underline sm:text-5xl lg:text-6xl"
          >
            {email}
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex min-h-11 items-center rounded-full bg-raised px-5 text-sm font-medium transition-colors hover:bg-line"
          >
            <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
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
      </div>
    </Section>
  )
}
