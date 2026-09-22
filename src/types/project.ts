export type ProjectStatus = 'live' | 'in-development' | 'completed'

export type Project = {
  /** Used in the URL: /projects/<slug>. Lowercase words joined by dashes. */
  slug: string
  title: string
  /** One line shown on the card. */
  tagline: string
  /** Longer text shown on the project page. */
  description: string
  /** Bullet points shown on the project page. */
  highlights?: string[]
  /** Path to an image in public/projects, e.g. "/projects/move.svg". */
  image: string
  imageAlt: string
  /** Tools and technologies used, shown as chips. */
  tools: string[]
  links: { github?: string; live?: string }
  /** Display date, e.g. "Aug 2026 – Present". */
  date: string
  status: ProjectStatus
  /** Featured projects are listed first. */
  featured?: boolean
}
