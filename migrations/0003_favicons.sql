-- Adds the site and admin favicon settings (edited at /admin → Site & SEO).
-- Keeps any value already there, e.g. on a database seeded after these fields existed.
UPDATE settings
SET value = json_set(
  value,
  '$.favicon', coalesce(json_extract(value, '$.favicon'), '/favicon.svg'),
  '$.adminFavicon', coalesce(json_extract(value, '$.adminFavicon'), '')
)
WHERE key = 'site';
