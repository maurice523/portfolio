import { useState } from 'react'
import { getDefaultTheme, getSelectableThemes, THEME_STORAGE_KEY } from '@/shared/theme'
import { useContent } from './context'

/** The themes a visitor can pick, which one is active, and a function to switch. */
export function useThemeChoice() {
  const { themes } = useContent()
  const [current, setCurrent] = useState(
    () => document.documentElement.dataset.theme ?? getDefaultTheme(themes)?.id,
  )

  function choose(id: string) {
    document.documentElement.dataset.theme = id
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id)
    } catch {
      // Storage can be blocked (e.g. private browsing); the choice just won't be remembered.
    }
    setCurrent(id)
  }

  return { themes: getSelectableThemes(themes), current, choose }
}
