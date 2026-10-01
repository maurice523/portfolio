-- Site content, edited from /admin. Lists (highlights, tools, bullets, colors) are stored as JSON
-- text; sort_order keeps the order you set in the admin.

-- One row per settings group: profile, site, hero, about, education, skills, sections.
CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL -- JSON
);

CREATE TABLE projects (
  slug        TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  tagline     TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  highlights  TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
  image       TEXT NOT NULL DEFAULT '',
  image_alt   TEXT NOT NULL DEFAULT '',
  tools       TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
  github_url  TEXT NOT NULL DEFAULT '',
  live_url    TEXT NOT NULL DEFAULT '',
  date        TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL CHECK (status IN ('live', 'in-development', 'completed')),
  featured    INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL
);

CREATE TABLE experience (
  id         INTEGER PRIMARY KEY,
  company    TEXT NOT NULL,
  role       TEXT NOT NULL,
  date       TEXT NOT NULL DEFAULT '',
  bullets    TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
  sort_order INTEGER NOT NULL
);

CREATE TABLE themes (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  scheme     TEXT NOT NULL CHECK (scheme IN ('dark', 'light')),
  colors     TEXT NOT NULL, -- JSON object: bg, surface, raised, line, fg, muted, accent, amber, green
  is_public  INTEGER NOT NULL DEFAULT 0,
  is_default INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL
);
