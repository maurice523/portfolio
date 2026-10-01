// Which browser tab icon to show. Used by the Worker (first page load) and the app (navigation).
import type { Settings } from './schema'

export const DEFAULT_FAVICON = '/favicon.svg'

export type SiteArea = 'site' | 'admin'

export function faviconHref(site: Settings['site'], area: SiteArea): string {
  return (area === 'admin' && site.adminFavicon) || site.favicon || DEFAULT_FAVICON
}
