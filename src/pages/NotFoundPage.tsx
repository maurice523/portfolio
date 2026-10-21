import { Link } from 'react-router'
import { Container } from '@/components/Container'
import { useContent } from '@/content/context'

export function NotFoundPage() {
  const { profile } = useContent().settings

  return (
    <main>
      <title>{`Page not found | ${profile.name}`}</title>
      <Container>
        <div className="max-w-xl py-16 md:py-24">
          <p className="text-sm font-medium text-muted">Error 404</p>
          <h1 className="mt-3 text-5xl leading-[0.95] font-bold tracking-[-0.03em] [font-stretch:82%] md:text-6xl">
            Page not found
          </h1>
          <p className="mt-3 text-muted">
            This page doesn’t exist or may have moved. Check the address, or head back to the home
            page to see all projects.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center rounded-full bg-accent px-6 py-3 font-medium text-bg transition-colors hover:bg-fg"
          >
            Back to home
          </Link>
        </div>
      </Container>
    </main>
  )
}
