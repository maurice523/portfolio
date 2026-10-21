-- Adds two themes taken from a Lake Placid Blue Jazz Bass and makes Lake Placid the default.
-- The older themes stay in the database (edit or re-enable them at /admin → Themes); they're
-- just no longer offered to visitors.
INSERT OR IGNORE INTO themes (id, name, scheme, colors, is_public, is_default, sort_order) VALUES
  ('lake-placid', 'Lake Placid', 'light', '{"bg":"#e6e9ec","surface":"#f3f4f6","raised":"#d8dde3","line":"#c4cbd4","fg":"#0e1a2e","muted":"#4a566b","accent":"#1d4fa0","amber":"#8a5510","green":"#276b3b"}', 1, 0, -2),
  ('rosewood', 'Rosewood', 'dark', '{"bg":"#1d1411","surface":"#261b17","raised":"#30231d","line":"#3b2a22","fg":"#f2eadf","muted":"#bba894","accent":"#e9b04f","amber":"#f0c77a","green":"#8fd19e"}', 1, 0, -1);

UPDATE themes SET is_default = (id = 'lake-placid'), is_public = (id IN ('lake-placid', 'rosewood'));
