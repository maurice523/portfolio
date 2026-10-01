import { useEffect } from 'react'
import { faviconHref, type SiteArea } from '@/shared/favicon'
import { useContent } from './context'

/**
 * Keeps the browser tab icon in sync while the app runs: when moving between the site and
 * /admin, and right after a new favicon is saved. (The Worker sets it for the first load.)
 */
export function useFavicon(area: SiteArea) {
  const href = faviconHref(useContent().settings.site, area)

  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.append(link)
    }
    link.removeAttribute('type')
    link.href = href
  }, [href])
}
