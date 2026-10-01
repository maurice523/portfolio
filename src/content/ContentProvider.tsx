import { useEffect, useState, type ReactNode } from 'react'
import { CONTENT_ELEMENT_ID, type Content } from '@/shared/schema'
import { getDefaultTheme, themesCss } from '@/shared/theme'
import { ContentContext } from './context'

// The Worker puts the content into every page (see worker/inject.ts), so it is usually
// available immediately. If it isn't (e.g. a plain `vite preview`), fetch it instead.
function readEmbeddedContent(): Content | null {
  const text = document.getElementById(CONTENT_ELEMENT_ID)?.textContent
  if (!text) return null
  try {
    return JSON.parse(text) as Content
  } catch {
    return null
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(readEmbeddedContent)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (content) return
    fetch('/api/content')
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then(setContent)
      .catch(() => setFailed(true))
  }, [content])

  // Without the Worker's boot script nobody has picked a theme yet, so use the default.
  useEffect(() => {
    const fallback = content && getDefaultTheme(content.themes)
    if (fallback && !document.documentElement.dataset.theme) {
      document.documentElement.dataset.theme = fallback.id
    }
  }, [content])

  if (!content) {
    return failed ? (
      <main className="grid min-h-dvh place-items-center p-6 text-center">
        <p className="text-muted">The site couldn’t load right now. Please try again shortly.</p>
      </main>
    ) : null
  }

  return (
    <ContentContext value={{ content, setContent }}>
      {/* Kept in sync with the content, so theme edits in /admin show up without a reload */}
      <style>{themesCss(content.themes)}</style>
      {children}
    </ContentContext>
  )
}
