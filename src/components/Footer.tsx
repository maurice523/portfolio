import { useContent } from '@/content/context'
import { Container } from './Container'

export function Footer() {
  const { profile, site } = useContent().settings

  return (
    <footer className="mt-8 border-t border-line py-6 text-sm text-muted">
      <Container>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-balance">
            © {new Date().getFullYear()} {profile.name}
            {site.footerNote && ` · ${site.footerNote}`}
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex min-h-11 items-center self-start hover:text-fg"
          >
            {profile.email}
          </a>
        </div>
        {/* Devicon logos are MIT */}
        <p className="mt-2 text-[0.8rem] text-muted/80">Tech logos from Devicon.</p>
      </Container>
    </footer>
  )
}
