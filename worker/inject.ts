// Adds the site content and theme colors to each HTML page as it streams to the browser.
// React reads the content right away (no extra request), and the theme is applied before the
// first paint, so colors never flash.
import { CONTENT_ELEMENT_ID, type Content } from '../src/shared/schema.ts'
import { faviconHref, type SiteArea } from '../src/shared/favicon.ts'
import { getDefaultTheme, themeBootScript, themesCss } from '../src/shared/theme.ts'

export function injectContent(page: Response, content: Content, area: SiteArea): Response {
  const { site } = content.settings
  // "<" is escaped so text like "</script>" inside the content can't end the tag early.
  const json = JSON.stringify(content).replace(/</g, '\\u003c')
  const themeColor = getDefaultTheme(content.themes)?.colors.bg

  return new HTMLRewriter()
    .on('title', {
      element: (el) => void el.setInnerContent(site.title),
    })
    .on('link[rel="icon"]', {
      element: (el) => {
        el.setAttribute('href', faviconHref(site, area))
        // The icon may be PNG or ICO now, so let the browser detect the type.
        el.removeAttribute('type')
      },
    })
    .on('meta[name="description"]', {
      element: (el) => void el.setAttribute('content', site.description),
    })
    .on('meta[name="theme-color"]', {
      element: (el) => void (themeColor && el.setAttribute('content', themeColor)),
    })
    .on('head', {
      element: (el) =>
        void el.append(
          `<style id="theme-css">${themesCss(content.themes)}</style>` +
            `<script>${themeBootScript(content.themes)}</script>` +
            `<script type="application/json" id="${CONTENT_ELEMENT_ID}">${json}</script>`,
          { html: true },
        ),
    })
    .transform(page)
}
