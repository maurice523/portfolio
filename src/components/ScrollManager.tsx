import { useEffect } from 'react'
import { useLocation } from 'react-router'

// On every page change: scroll to the #section in the URL if there is one, otherwise to the top.
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}
