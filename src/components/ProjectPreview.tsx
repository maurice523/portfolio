import clsx from 'clsx'
import type { Project } from '@/types/project'

// The image at the top of a card / project page.
// Screenshots sit in a browser window that rises from the bottom edge of a dot-grid
// backdrop, so the cut-off reads as intentional; if the project has a live site, its
// domain goes in the address bar. SVG artwork (e.g. a coming-soon card) shows full-bleed.
export function ProjectPreview({
  project,
  className,
}: {
  project: Pick<Project, 'image' | 'imageAlt' | 'links'>
  className?: string
}) {
  const { image, imageAlt, links } = project

  if (image.endsWith('.svg')) {
    return (
      <img
        src={image}
        alt={imageAlt}
        loading="lazy"
        decoding="async"
        className={clsx('w-full max-w-full object-cover', className)}
      />
    )
  }

  const domain = links.live && new URL(links.live).host

  return (
    <div
      className={clsx(
        'relative overflow-hidden bg-bg bg-[radial-gradient(circle,var(--color-line)_1.5px,transparent_1.5px)] bg-[size:20px_20px]',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_110%,color-mix(in_oklab,var(--color-accent)_22%,transparent),transparent_65%)]"
      />
      <div className="absolute inset-x-[7%] top-[11%] -bottom-px flex flex-col overflow-hidden rounded-t-lg border border-b-0 border-line bg-surface shadow-[0_-8px_40px_-12px_rgb(0_0_0/0.7)] transition duration-300 group-hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        <div className="flex h-6 shrink-0 items-center gap-1.5 border-b border-line bg-raised px-2.5">
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          {domain && (
            <>
              <span className="mx-auto truncate rounded bg-bg px-2 font-mono text-[0.625rem] leading-4 text-muted">
                {domain}
              </span>
              <span className="w-8" />
            </>
          )}
        </div>
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          className="min-h-0 w-full flex-1 object-cover object-top-left"
        />
      </div>
    </div>
  )
}
