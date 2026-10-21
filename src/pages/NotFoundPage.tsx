import { PageFrame } from '@/components/PageFrame'
import { PageLink } from '@/components/PageTransition'
import { useContent } from '@/content/context'

export function NotFoundPage() {
  const { profile } = useContent().settings

  return (
    <PageFrame
      title="Page not found"
      intro="This page doesn’t exist or may have moved. Check the address, or go back to the home page."
    >
      <title>{`Page not found | ${profile.name}`}</title>
      <PageLink
        to="/"
        className="inline-flex items-center rounded-full bg-accent px-6 py-3 font-medium text-bg transition-colors hover:bg-fg"
      >
        Back to home
      </PageLink>
    </PageFrame>
  )
}
