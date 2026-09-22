import { Link } from 'react-router'
import { profile } from '@/data/profile'
import { Container } from './Container'

export function NavBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-bg/80 backdrop-blur">
      <Container>
        <nav className="flex h-16 items-center justify-between gap-4" aria-label="Main">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center font-semibold tracking-tight hover:text-accent"
          >
            {profile.name}
          </Link>
          <ul className="flex items-center gap-1 text-sm font-medium">
            <li>
              <Link
                to="/#projects"
                className="inline-flex min-h-11 items-center rounded-md px-3 text-muted hover:text-fg"
              >
                Projects
              </Link>
            </li>
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex min-h-11 items-center rounded-md px-3 text-muted hover:text-fg"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  )
}
