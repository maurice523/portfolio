// Turns saved themes into CSS. Tailwind's color classes (bg-surface, text-accent, ...) read
// --color-* variables, so overriding those variables re-colors the whole site at runtime.
import { colorTokens, type Theme } from './schema'

export const THEME_STORAGE_KEY = 'theme'

/** CSS declarations for one theme, e.g. "color-scheme:dark;--color-bg:#0f131a;..." */
export function themeDeclarations(theme: Theme): string {
  return [
    `color-scheme:${theme.scheme}`,
    ...colorTokens.map((token) => `--color-${token}:${theme.colors[token]}`),
  ].join(';')
}

export function getDefaultTheme(themes: Theme[]): Theme | undefined {
  return themes.find((theme) => theme.isDefault) ?? themes[0]
}

/** Themes a visitor can switch between: the public ones, plus the default. */
export function getSelectableThemes(themes: Theme[]): Theme[] {
  return themes.filter((theme) => theme.isPublic || theme.isDefault)
}

/**
 * A stylesheet with the default theme on :root and one rule per selectable theme,
 * applied by setting <html data-theme="id">. Safe to inline: IDs and colors are validated.
 */
export function themesCss(themes: Theme[]): string {
  const fallback = getDefaultTheme(themes)
  if (!fallback) return ''
  return [
    `:root{${themeDeclarations(fallback)}}`,
    ...getSelectableThemes(themes).map(
      (theme) => `:root[data-theme="${theme.id}"]{${themeDeclarations(theme)}}`,
    ),
  ].join('\n')
}

/**
 * A tiny script that runs before the page paints: it applies the visitor's saved theme (or the
 * default) so the colors never flash.
 */
export function themeBootScript(themes: Theme[]): string {
  const ids = getSelectableThemes(themes).map((theme) => theme.id)
  const fallback = getDefaultTheme(themes)?.id ?? ''
  return `(function(){var t;try{t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){}var ids=${JSON.stringify(ids)};document.documentElement.dataset.theme=ids.indexOf(t)>-1?t:${JSON.stringify(fallback)}})()`
}
