// The shape of everything on the site. Used by the Worker (to validate admin saves before they
// reach D1) and by the React app (types + form validation), so the rules live in one place.
import { z } from 'zod'

const text = z.string().trim()
const url = text.refine((value) => value === '' || /^(https?:\/\/|\/|mailto:)/.test(value), {
  message: 'Must start with https://, / or mailto:',
})
const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use a 6-digit hex color like #ff6a1f')
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Lowercase letters, numbers and dashes only')
const percent = z.number().min(0).max(100)

// ---------- Themes ----------

export const colorTokens = [
  'bg',
  'surface',
  'raised',
  'line',
  'fg',
  'muted',
  'accent',
  'amber',
  'green',
] as const
export type ColorToken = (typeof colorTokens)[number]

export const themeSchema = z.object({
  id: slug,
  name: text.min(1),
  scheme: z.enum(['dark', 'light']),
  colors: z.object(
    Object.fromEntries(colorTokens.map((token) => [token, hex])) as Record<ColorToken, typeof hex>,
  ),
  /** Visitors can pick this theme from the switcher in the nav. */
  isPublic: z.boolean(),
  /** The theme new visitors see. Exactly one theme is the default. */
  isDefault: z.boolean(),
})
export type Theme = z.infer<typeof themeSchema>

export const themesSchema = z
  .array(themeSchema)
  .min(1, 'Keep at least one theme')
  .refine((list) => list.filter((theme) => theme.isDefault).length === 1, {
    message: 'Pick exactly one default theme',
  })
  .refine((list) => new Set(list.map((theme) => theme.id)).size === list.length, {
    message: 'Theme IDs must be unique',
  })

// ---------- Projects ----------

export const projectStatuses = ['live', 'in-development', 'completed'] as const
export type ProjectStatus = (typeof projectStatuses)[number]

export const projectSchema = z.object({
  /** Used in the URL: /projects/<slug>. */
  slug,
  title: text.min(1),
  /** One line shown on the card. */
  tagline: text,
  /** Longer text on the project page. Separate paragraphs with a blank line. */
  description: text,
  highlights: z.array(text),
  /** Image URL, e.g. /projects/move.svg or an uploaded /media/... file. */
  image: url,
  imageAlt: text,
  tools: z.array(text),
  links: z.object({ github: url, live: url }),
  /** Display date, e.g. "Aug 2026 – Present". */
  date: text,
  status: z.enum(projectStatuses),
  /** Featured projects are listed first and shown larger. */
  featured: z.boolean(),
})
export type Project = z.infer<typeof projectSchema>

export const projectsSchema = z
  .array(projectSchema)
  .refine((list) => new Set(list.map((project) => project.slug)).size === list.length, {
    message: 'Project slugs must be unique',
  })

// ---------- Experience ----------

export const experienceSchema = z.object({
  company: text.min(1),
  role: text.min(1),
  date: text,
  bullets: z.array(text),
})
export type Experience = z.infer<typeof experienceSchema>
export const experienceListSchema = z.array(experienceSchema)

// ---------- Settings (one row each in the settings table) ----------

const logoSchema = z.object({ name: text.min(1), src: url })
export type Logo = z.infer<typeof logoSchema>

const sectionCopySchema = z.object({
  /** Label in the top navigation. Leave empty to hide it from the nav. */
  navLabel: text,
  title: text.min(1),
  intro: text,
})

export const settingsSchemas = {
  profile: z.object({
    name: text.min(1),
    headline: text,
    location: text,
    email: z.email(),
    photo: url,
    links: z.object({ github: url, linkedin: url, resume: url }),
    languages: z.array(text),
  }),
  site: z.object({
    /** Browser tab title for the home page. */
    title: text.min(1),
    /** Search engine description. */
    description: text,
    footerNote: text,
  }),
  hero: z.object({
    eyebrow: text,
    heading: text.min(1),
    intro: text,
    ctaLabel: text,
  }),
  about: z.object({
    bio: z.array(text),
    playgroundLabel: text,
    /** Big faded words behind the draggable chips. */
    playgroundWords: z.array(text),
    interests: z.array(
      z.object({
        text: text.min(1),
        color: hex,
        top: percent,
        left: percent,
        rotate: z.number().min(-45).max(45),
      }),
    ),
    currentlyBuilding: z.object({
      /** Project slug to link to. Empty hides the card. */
      slug: z.union([slug, z.literal('')]),
      blurb: text,
    }),
    techStack: z.object({
      title: text,
      text,
      innerRing: z.array(logoSchema),
      outerRing: z.array(logoSchema),
    }),
  }),
  education: z.object({
    school: text,
    degree: text,
    date: text,
    details: z.array(text),
  }),
  skills: z.object({
    groups: z.array(z.object({ name: text.min(1), items: z.array(text) })),
  }),
  sections: z.object({
    projects: sectionCopySchema,
    about: sectionCopySchema,
    experience: sectionCopySchema,
    skills: sectionCopySchema,
    contact: sectionCopySchema,
  }),
}

export type SettingsKey = keyof typeof settingsSchemas
export const settingsKeys = Object.keys(settingsSchemas) as SettingsKey[]
export type Settings = { [K in SettingsKey]: z.infer<(typeof settingsSchemas)[K]> }
export type SectionId = keyof Settings['sections']

// ---------- Everything together ----------

/** All site content, as served by GET /api/content and embedded in each page. */
export type Content = {
  settings: Settings
  projects: Project[]
  experience: Experience[]
  themes: Theme[]
}

/** Collections that the admin saves as a whole list (which also stores their order). */
export const collectionSchemas = {
  projects: projectsSchema,
  experience: experienceListSchema,
  themes: themesSchema,
}
export type CollectionKey = keyof typeof collectionSchemas

/** Turns a zod error into one readable line per problem, e.g. "projects.2.slug: Lowercase…". */
export function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => (issue.path.length ? `${issue.path.join('.')}: ` : '') + issue.message)
    .join('\n')
}

/** ID of the <script type="application/json"> tag the Worker puts the content in. */
export const CONTENT_ELEMENT_ID = 'site-content'
