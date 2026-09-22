# mauriceneme.com

Personal portfolio of Maurice Neme. Built with Vite, React, TypeScript and Tailwind CSS v4, deployed on Cloudflare.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts

| Command             | What it does                         |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the dev server with hot reload |
| `npm run build`     | Type-check and build to `dist/`      |
| `npm run preview`   | Serve the production build locally   |
| `npm run typecheck` | Run the TypeScript compiler          |
| `npm run lint`      | Lint with oxlint                     |
| `npm run format`    | Format all files with Prettier       |

## Project structure

```
src/
  main.tsx      # app entry: fonts, global CSS, router
  index.css     # Tailwind import + design tokens (@theme)
  App.tsx       # routes + layout
  pages/        # one file per page (Home, Project, 404)
  components/   # reusable UI pieces (ProjectCard, ToolChip, ...)
  data/         # content: profile.ts, projects.ts
  types/        # TypeScript types
public/         # static files served as-is (favicon, resume, project images)
```

## How to add a project

_Coming in a later phase: add an image to `public/projects/` and one entry to `src/data/projects.ts`._
