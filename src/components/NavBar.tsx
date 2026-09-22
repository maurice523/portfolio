import { useState } from 'react'
import { Link } from 'react-router'
import { profile } from '@/data/profile'
import { Container } from './Container'
import { CloseIcon, MenuIcon } from './icons'

const sections = [
  { label: 'Projects', to: '/#projects' },
  { label: 'About', to: '/#about' },
  { label: 'Experience', to: '/#experience' },
  { label: 'Contact', to: '/#contact' },
]

export function NavBar() {
  // Mobile menu open/closed. Desktop always shows the links.
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-bg/80 backdrop-blur">
      <Container>
        <nav className="flex h-14 items-center justify-between gap-4" aria-label="Main">
          <Link
            to="/"
            onClick={close}
            className="inline-flex min-h-11 items-center font-semibold tracking-tight hover:text-accent"
          >
            {profile.name}
          </Link>

          <ul className="hidden items-center gap-1 text-sm font-medium sm:flex">
            {sections.map((section) => (
              <li key={section.to}>
                <Link
                  to={section.to}
                  className="inline-flex min-h-11 items-center rounded-md px-3 text-muted hover:text-fg"
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="-mr-2 grid size-11 place-items-center rounded-md text-muted hover:text-fg sm:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </nav>

        {open && (
          <ul id="mobile-menu" className="flex flex-col border-t border-line py-2 sm:hidden">
            {sections.map((section) => (
              <li key={section.to}>
                <Link
                  to={section.to}
                  onClick={close}
                  className="flex min-h-11 items-center font-medium text-muted hover:text-fg"
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </header>
  )
}
