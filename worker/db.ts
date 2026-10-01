// Reading and writing site content in D1.
// The same SQL statements are used by the Worker and by scripts/build-seed.ts.
import {
  settingsKeys,
  type CollectionKey,
  type Content,
  type Experience,
  type Project,
  type Settings,
  type SettingsKey,
  type Theme,
} from '../src/shared/schema.ts'

export type Statement = { sql: string; params: (string | number)[] }

type ProjectRow = {
  slug: string
  title: string
  tagline: string
  description: string
  highlights: string
  image: string
  image_alt: string
  tools: string
  github_url: string
  live_url: string
  date: string
  status: Project['status']
  featured: number
}
type ExperienceRow = { company: string; role: string; date: string; bullets: string }
type ThemeRow = {
  id: string
  name: string
  scheme: Theme['scheme']
  colors: string
  is_public: number
  is_default: number
}

export function settingStatement<K extends SettingsKey>(key: K, value: Settings[K]): Statement {
  return {
    sql: 'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value',
    params: [key, JSON.stringify(value)],
  }
}

/**
 * Replaces a whole collection; the list order becomes sort_order.
 * `list` must already be validated with collectionSchemas[key].
 */
export function collectionStatements(key: CollectionKey, list: readonly unknown[]): Statement[] {
  const inserts = list.map((item, order): Statement => {
    if (key === 'projects') {
      const p = item as Project
      return {
        sql: `INSERT INTO projects (slug, title, tagline, description, highlights, image, image_alt, tools,
                github_url, live_url, date, status, featured, sort_order)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          p.slug,
          p.title,
          p.tagline,
          p.description,
          JSON.stringify(p.highlights),
          p.image,
          p.imageAlt,
          JSON.stringify(p.tools),
          p.links.github,
          p.links.live,
          p.date,
          p.status,
          p.featured ? 1 : 0,
          order,
        ],
      }
    }
    if (key === 'experience') {
      const e = item as Experience
      return {
        sql: 'INSERT INTO experience (company, role, date, bullets, sort_order) VALUES (?, ?, ?, ?, ?)',
        params: [e.company, e.role, e.date, JSON.stringify(e.bullets), order],
      }
    }
    const t = item as Theme
    return {
      sql: 'INSERT INTO themes (id, name, scheme, colors, is_public, is_default, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      params: [
        t.id,
        t.name,
        t.scheme,
        JSON.stringify(t.colors),
        t.isPublic ? 1 : 0,
        t.isDefault ? 1 : 0,
        order,
      ],
    }
  })
  return [{ sql: `DELETE FROM ${key}`, params: [] }, ...inserts]
}

function prepare(db: D1Database, statements: Statement[]) {
  return statements.map(({ sql, params }) => db.prepare(sql).bind(...params))
}

/** Runs the statements as one transaction: either all of them apply, or none do. */
export async function write(db: D1Database, statements: Statement[]) {
  await db.batch(prepare(db, statements))
}

/** Loads all site content in a single round trip to D1. */
export async function loadContent(db: D1Database): Promise<Content> {
  const [settingsResult, projectsResult, experienceResult, themesResult] = await db.batch([
    db.prepare('SELECT key, value FROM settings'),
    db.prepare('SELECT * FROM projects ORDER BY sort_order'),
    db.prepare('SELECT * FROM experience ORDER BY sort_order'),
    db.prepare('SELECT * FROM themes ORDER BY sort_order'),
  ])

  const settingsRows = settingsResult.results as { key: string; value: string }[]
  const settings = Object.fromEntries(
    settingsRows.map((row) => [row.key, JSON.parse(row.value)]),
  ) as Settings
  const missing = settingsKeys.filter((key) => !(key in settings))
  if (missing.length) throw new Error(`Missing settings in D1: ${missing.join(', ')}`)

  return {
    settings,
    projects: (projectsResult.results as ProjectRow[]).map((row) => ({
      slug: row.slug,
      title: row.title,
      tagline: row.tagline,
      description: row.description,
      highlights: JSON.parse(row.highlights),
      image: row.image,
      imageAlt: row.image_alt,
      tools: JSON.parse(row.tools),
      links: { github: row.github_url, live: row.live_url },
      date: row.date,
      status: row.status,
      featured: row.featured === 1,
    })),
    experience: (experienceResult.results as ExperienceRow[]).map((row) => ({
      company: row.company,
      role: row.role,
      date: row.date,
      bullets: JSON.parse(row.bullets),
    })),
    themes: (themesResult.results as ThemeRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      scheme: row.scheme,
      colors: JSON.parse(row.colors),
      isPublic: row.is_public === 1,
      isDefault: row.is_default === 1,
    })),
  }
}
