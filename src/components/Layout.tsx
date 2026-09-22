import { Outlet } from 'react-router'
import { Footer } from './Footer'
import { NavBar } from './NavBar'
import { ScrollManager } from './ScrollManager'

// Shared frame for every page. <Outlet /> is where the current page renders.
export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollManager />
      <NavBar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
