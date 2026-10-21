import { MotionConfig } from 'motion/react'
import { Outlet } from 'react-router'
import { useFavicon } from '@/content/useFavicon'
import { PageTransitions } from './PageTransition'
import { ScrollManager } from './ScrollManager'

// Shared frame for every page. <Outlet /> is where the current page renders; the home page
// fills the screen on its own, and the others bring their header and footer (PageFrame).
export function Layout() {
  useFavicon('site')

  return (
    // reducedMotion="user": Motion animations skip movement when the visitor prefers reduced motion
    <MotionConfig reducedMotion="user">
      <PageTransitions>
        <ScrollManager />
        <Outlet />
      </PageTransitions>
    </MotionConfig>
  )
}
