import { useContent } from '@/content/context'
import { BassGuitar } from './BassGuitar'
import { Container } from './Container'
import { GitHubIcon, LinkedInIcon, MailIcon } from './icons'
import { BlurFade } from './ui/BlurFade'

const iconLink =
  'grid size-11 place-items-center rounded-full border border-line text-muted transition-colors hover:border-fg hover:text-fg'

export function Hero() {
  const { profile, hero } = useContent().settings

  return (
    <div className="overflow-x-clip pt-10 pb-12 md:pt-16">
      <Container>
        {/* The page's one entrance: each line fades in a beat after the last */}
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            {hero.eyebrow && (
              <BlurFade>
                <p className="text-sm font-medium text-muted md:text-base">{hero.eyebrow}</p>
              </BlurFade>
            )}
            <BlurFade delay={0.08}>
              <h1 className="mt-4 text-6xl leading-[0.9] font-bold tracking-[-0.035em] [font-stretch:78%] sm:text-7xl lg:text-[6.5rem]">
                {hero.heading}
              </h1>
            </BlurFade>
          </div>

          <BlurFade delay={0.16}>
            {hero.intro && <p className="max-w-md text-lg text-pretty text-muted">{hero.intro}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="inline-flex min-h-11 items-center rounded-full bg-accent px-6 font-medium text-bg transition-colors hover:bg-fg"
              >
                {hero.ctaLabel || 'See my projects'}
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
          </BlurFade>
        </div>
      </Container>

      {/* The bass runs the full width of the window, wider than the text above it */}
      <BlurFade delay={0.3} className="mt-10 px-2 lg:mt-6 lg:px-6">
        <BassGuitar />
      </BlurFade>
    </div>
  )
}
