-- "Currently Working On" gets its own settings group (edited at /admin → Currently working). It
-- can show one of the projects or a card of its own. The project and blurb that used to live in
-- the About settings as currentlyBuilding carry over.
INSERT OR IGNORE INTO settings (key, value)
SELECT
  'currentlyWorking',
  json_object(
    'mode', CASE WHEN coalesce(json_extract(value, '$.currentlyBuilding.slug'), '') = '' THEN 'none' ELSE 'project' END,
    'slug', coalesce(json_extract(value, '$.currentlyBuilding.slug'), ''),
    'blurb', coalesce(json_extract(value, '$.currentlyBuilding.blurb'), ''),
    'custom', json('{"title":"","tagline":"","description":"","highlights":[],"image":"","imageAlt":"","tools":[],"links":{"github":"","live":""},"date":"","status":"in-development"}')
  )
FROM settings
WHERE key = 'about';

UPDATE settings SET value = json_remove(value, '$.currentlyBuilding') WHERE key = 'about';
