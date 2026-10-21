// Turns the saved default theme into CSS. Tailwind's color classes (bg-surface, text-accent, ...)
// read --color-* variables, so overriding those variables re-colors the whole site at runtime.
import { colorTokens, type Theme } from './schema'

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

/**
 * The default theme's colors on :root. Everyone sees that theme; /admin picks which one it is.
 * Safe to inline: colors are validated.
 */
export function themesCss(themes: Theme[]): string {
  const theme = getDefaultTheme(themes)
  return theme ? `:root{${themeDeclarations(theme)}}` : ''
}
