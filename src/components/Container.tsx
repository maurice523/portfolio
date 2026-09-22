import type { ReactNode } from 'react'

// Centers content and keeps a max width, with side padding on small screens.
export function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-5xl px-4 md:px-6">{children}</div>
}
