import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Navigate, NavLink, Route, Routes } from 'react-router'
import { useContent } from '@/content/context'
import { DraftsContext, isDirty, type Drafts } from './drafts'
import { AboutPage } from './pages/AboutPage'
import { EducationPage } from './pages/EducationPage'
import { ExperiencePage } from './pages/ExperiencePage'
import { HeroPage } from './pages/HeroPage'
import { MediaPage } from './pages/MediaPage'
import { ProfilePage } from './pages/ProfilePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { SectionsPage } from './pages/SectionsPage'
import { SitePage } from './pages/SitePage'
import { SkillsPage } from './pages/SkillsPage'
import { ThemesPage } from './pages/ThemesPage'

// Each page's draft is stored under its path, so the nav can mark pages with unsaved changes.
const pages = [
  { path: 'projects', label: 'Projects', element: <ProjectsPage /> },
  { path: 'themes', label: 'Themes', element: <ThemesPage /> },
  { path: 'hero', label: 'Home & hero', element: <HeroPage /> },
  { path: 'about', label: 'About', element: <AboutPage /> },
  { path: 'experience', label: 'Experience', element: <ExperiencePage /> },
  { path: 'education', label: 'Education', element: <EducationPage /> },
  { path: 'skills', label: 'Skills', element: <SkillsPage /> },
  { path: 'sections', label: 'Section titles', element: <SectionsPage /> },
  { path: 'profile', label: 'Profile & links', element: <ProfilePage /> },
  { path: 'site', label: 'Site & SEO', element: <SitePage /> },
  { path: 'media', label: 'Media library', element: <MediaPage /> },
]

/** The admin dashboard at /admin. Cloudflare Access makes sure only you can open it. */
export default function AdminApp() {
  const content = useContent()
  const [drafts, setDrafts] = useState<Drafts>({})
  const savedFor: Record<string, unknown> = {
    projects: content.projects,
    themes: content.themes,
    experience: content.experience,
    ...content.settings,
  }
  const dirtyPages = pages.filter((page) => isDirty(drafts, page.path, savedFor[page.path]))
  const hasUnsaved = dirtyPages.length > 0

  // Warn before closing the tab with unsaved edits.
  useEffect(() => {
    if (!hasUnsaved) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [hasUnsaved])

  return (
    <DraftsContext value={{ drafts, setDrafts }}>
      <div className="min-h-dvh md:pl-60">
        <aside className="border-b border-line bg-surface md:fixed md:inset-y-0 md:left-0 md:w-60 md:border-r md:border-b-0">
          <div className="flex items-center justify-between gap-2 px-4 py-3 md:block md:py-5">
            <p className="font-semibold tracking-tight">
              {content.settings.profile.name} <span className="text-muted">· Admin</span>
            </p>
            <a
              href="/"
              target="_blank"
              className="text-sm text-muted hover:text-fg md:mt-1 md:block"
            >
              View site ↗
            </a>
          </div>
          <nav aria-label="Admin">
            <ul className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:overflow-visible">
              {pages.map((page) => (
                <li key={page.path} className="shrink-0">
                  <NavLink
                    to={page.path}
                    className={({ isActive }) =>
                      clsx(
                        'flex min-h-9 items-center justify-between gap-2 rounded-md px-3 text-sm font-medium',
                        isActive ? 'bg-raised text-fg' : 'text-muted hover:text-fg',
                      )
                    }
                  >
                    {page.label}
                    {dirtyPages.includes(page) && (
                      <span className="size-2 rounded-full bg-amber" title="Unsaved changes" />
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="mx-auto max-w-4xl px-4 py-6 md:px-8 md:py-10">
          <Routes>
            <Route index element={<Navigate to="projects" replace />} />
            {pages.map((page) => (
              <Route key={page.path} path={page.path} element={page.element} />
            ))}
            <Route path="*" element={<Navigate to="projects" replace />} />
          </Routes>
        </main>
      </div>
    </DraftsContext>
  )
}
