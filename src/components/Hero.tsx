import { lazy, Suspense } from 'react'
import { profile } from '@/data/profile'
import { Container } from './Container'
import { ErrorBoundary } from './ErrorBoundary'
import { GitHubIcon, LinkedInIcon, MailIcon } from './icons'

// three.js is large, so the 3D bass loads separately; the text renders right away.
const BassScene = lazy(() => import('./BassScene'))

const iconLink =
  'grid size-11 place-items-center rounded-lg border border-line text-muted hover:border-muted hover:text-fg'

export function Hero() {
  return (
    <Container>
      <div className="grid items-center gap-4 pt-10 md:pt-14 lg:min-h-[calc(100dvh-3.5rem)] lg:grid-cols-2 lg:gap-8 lg:pt-0">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-accent">
            Aspiring Software developer & Data Analyst · Boston, MA
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Hi, I’m Maurice.
          </h1>
          <p className="mt-4 text-lg text-balance text-muted md:text-xl">
            I build software that turns data into tools people actually use. I'm also a pretty funky
            bass player.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-medium text-bg hover:bg-accent/90"
            >
              See my projects
            </a>
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

        {/* 3D bass with a soft stage-light glow behind it */}
        <div className="relative h-80 min-w-0 sm:h-96 lg:h-[34rem]">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgb(255_106_31/0.16),transparent)]"
          />
          <ErrorBoundary>
            <Suspense fallback={null}>
              <BassScene />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </Container>
  )
}
