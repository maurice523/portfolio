import type { ReactNode } from 'react'
import { Container } from './Container'
import { SectionHeading } from './SectionHeading'

type SectionProps = {
  /** Used for in-page links, e.g. id="projects" → href="#projects". */
  id: string
  title: string
  eyebrow?: string
  intro?: string
  children: ReactNode
}

export function Section({ id, title, eyebrow, intro, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20 py-16 md:py-24">
      <Container>
        <SectionHeading title={title} eyebrow={eyebrow} intro={intro} />
        {children}
      </Container>
    </section>
  )
}
