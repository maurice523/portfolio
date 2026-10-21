import { useLayoutEffect, type RefObject } from 'react'

/**
 * Shrinks an inline-block of wrapping text to the width of its longest line. A browser leaves a
 * wrapped box as wide as the space it could use, so a small and a large copy of the same title
 * would have different proportions, and the morph between them (see PageTransition.tsx) would
 * show two misaligned copies. With tight boxes the text lines up all the way.
 */
export function useTightWidth(ref: RefObject<HTMLElement | null>, text: string) {
  useLayoutEffect(() => {
    const element = ref.current
    const parent = element?.parentElement
    if (!element || !parent) return

    function fit() {
      if (!element) return
      element.style.width = ''
      const range = document.createRange()
      range.selectNodeContents(element)
      // One rectangle per line of text
      const widest = Math.max(0, ...Array.from(range.getClientRects(), (rect) => rect.width))
      // Rounded up so the lines still fit and wrap in the same places
      if (widest) element.style.width = `${Math.ceil(widest) + 1}px`
    }

    fit()
    // Again once the display font has loaded, and whenever the space around it changes
    void document.fonts.ready.then(fit)
    const observer = new ResizeObserver(fit)
    observer.observe(parent)
    return () => observer.disconnect()
  }, [ref, text])
}
