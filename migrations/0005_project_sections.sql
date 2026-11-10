-- Adds a heading to each project (edited at /admin → Projects). The projects page groups
-- projects under their heading, in the order the headings first appear in the project list.
-- A project with no heading is listed without one.
ALTER TABLE projects ADD COLUMN section TEXT NOT NULL DEFAULT '';

-- A starting point for the projects already on the site; change them at /admin → Projects.
UPDATE projects SET section = 'Data analysis' WHERE slug = 'boston-trees';
UPDATE projects SET section = 'Software' WHERE slug IN ('move', 'order-test-data-generator', 'excel-io', 'portfolio');
