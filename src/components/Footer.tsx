import { profile } from '@/data/profile'
import { Container } from './Container'

export function Footer() {
  return (
    <footer className="mt-8 border-t border-line py-6 text-sm text-muted">
      <Container>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-balance">
            © {new Date().getFullYear()} {profile.name} · Built with React and Tailwind CSS
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex min-h-11 items-center self-start hover:text-fg"
          >
            {profile.email}
          </a>
        </div>
        {/* Required credit for the CC BY 3.0 model; Devicon logos are MIT */}
        <p className="mt-2 text-[0.8rem] text-muted/80">
          3D bass model: “Bass Guitar” by{' '}
          <a
            href="https://poly.pizza/m/ByBoHTCdYZ"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-fg"
          >
            Zsky
          </a>
          , licensed under{' '}
          <a
            href="https://creativecommons.org/licenses/by/3.0/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-fg"
          >
            CC BY 3.0
          </a>
          . Tech logos from Devicon.
        </p>
      </Container>
    </footer>
  )
}
