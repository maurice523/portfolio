# mauriceneme.com

Personal portfolio of Maurice Neme. Built with Vite, React, TypeScript and Tailwind CSS v4, running on Cloudflare Workers.

Everything on the site (text, projects, experience, skills and color themes) is stored in Cloudflare and edited at **[/admin](https://mauriceneme.com/admin)**. Changes go live on save, with no redeploy.

## How it works

| Piece                      | What it does                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| **Worker** (`worker/`)     | Runs before every request: serves `/api`, `/media`, and adds the content to each HTML page |
| **D1** (`portfolio`)       | SQLite database with the site content. Schema in `migrations/`                             |
| **R2** (`portfolio-media`) | Images and files uploaded from the admin, served at `/media/<file>`                        |
| **Cloudflare Access**      | Login in front of `/admin` and `/api/admin`. Only mauricenemee@gmail.com is allowed in     |

The Worker also checks the Access login token itself (`worker/auth.ts`), so the admin API stays locked even if a request skips Access.

## Getting started

```bash
npm install
npm run db:migrate   # create the local database and fill it with the starting content
npm run dev          # http://localhost:5173 (admin at /admin, no login needed locally)
```

Local development uses its own database and bucket in `.wrangler/`. Edits there never touch the live site.

## Scripts

| Command                 | What it does                                                      |
| ----------------------- | ----------------------------------------------------------------- |
| `npm run dev`           | Start the dev server (React app + Worker + local D1/R2)           |
| `npm run build`         | Type-check and build to `dist/`                                   |
| `npm run deploy`        | Build, apply new database migrations, and deploy                  |
| `npm run db:migrate`    | Apply database migrations to the local database                   |
| `npm run db:seed:build` | Regenerate `migrations/0002_seed.sql` from `scripts/seed-data.ts` |
| `npm run cf-typegen`    | Regenerate Worker types after changing `wrangler.jsonc`           |
| `npm run typecheck`     | Run the TypeScript compiler                                       |
| `npm run lint`          | Lint with oxlint                                                  |
| `npm run format`        | Format all files with Prettier                                    |

Pushing to `main` deploys automatically through Workers Builds, which also applies any new migrations.

## Project structure

```
worker/           # the Cloudflare Worker: API, auth, media, HTML injection
migrations/       # D1 database schema and starting content
scripts/          # seed data (the content from before the admin existed)
src/
  shared/         # content schema + validation, used by both the Worker and the app
  content/        # loads the content and makes it available to components
  admin/          # the /admin dashboard (loaded separately from the public site)
  components/     # public site UI
  pages/          # Home, Project, 404
public/           # static files (favicon, 3D model, logos, original screenshots)
```

## Changing the content shape

To add a new editable field:

1. Add it to the schema in `src/shared/schema.ts`.
2. Add a migration if it needs a new column. Settings fields are stored as JSON, so they don't.
3. Show it in a component, and add an input for it in `src/admin/pages/`.
