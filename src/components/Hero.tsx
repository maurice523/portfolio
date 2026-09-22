import { profile } from '@/data/profile'
import { Container } from './Container'
import { GitHubIcon, LinkedInIcon, MailIcon } from './icons'
import { Portrait } from './Portrait'

const iconLink =
  'grid size-11 place-items-center rounded-lg border border-line text-muted hover:border-muted hover:text-fg'

export function Hero() {
  return (
    <Container>
      <div className="max-w-3xl pt-10 pb-2 md:pt-16">
        <p className="font-mono text-sm text-muted">
          <span className="text-accent">~/boston $</span> whoami
          <span
            aria-hidden="true"
            className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-accent motion-reduce:animate-none"
          />
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{profile.name}</h1>
        <p className="mt-2 text-base text-balance text-muted md:text-lg">{profile.headline}</p>

        <div className="mt-6 flex flex-wrap items-end gap-5">
          <Portrait />
          <div className="flex gap-2">
            <a href={`mailto:${profile.email}`} aria-label="Email me" className={iconLink}>
              <MailIcon />
            </a>
            {profile.links.linkedin && (
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
                className={iconLink}
              >
                <LinkedInIcon />
              </a>
            )}
            {profile.links.github && (
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                className={iconLink}
              >
                <GitHubIcon />
              </a>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}
