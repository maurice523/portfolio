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
      </Container>
    </footer>
  )
}
