import { Link } from 'react-router'
import { Container } from '@/components/Container'
import { profile } from '@/data/profile'

export function NotFoundPage() {
  return (
    <main>
      <title>{`Page not found | ${profile.name}`}</title>
      <Container>
        <div className="max-w-xl py-24 md:py-32">
          <p className="font-mono text-sm text-accent">Error 404</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Page not found</h1>
          <p className="mt-4 text-lg text-muted">
            This page doesn’t exist or may have moved. Check the address, or head back to the home
            page to see all projects.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center rounded-lg bg-accent px-5 py-3 font-medium text-bg hover:bg-accent/90"
          >
            Back to home
          </Link>
        </div>
      </Container>
    </main>
  )
}
