import type { ReactNode } from 'react'
import { AboutSection } from '@/components/AboutSection'
import { ContactSection } from '@/components/ContactSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { PageFrame } from '@/components/PageFrame'
import { ProjectGrid } from '@/components/ProjectGrid'
import { SkillsSection } from '@/components/SkillsSection'
import { useContent } from '@/content/context'
import type { PageId } from '@/content/pages'

// /projects, /experience, /about and /contact
export function SectionPage({ id }: { id: PageId }) {
  const content = useContent()
  const { navLabel, title, intro } = content.settings.sections[id]

  const body: Record<PageId, ReactNode> = {
    projects: <ProjectGrid projects={content.projects} />,
    experience: <ExperienceSection />,
    about: (
      <>
        <AboutSection />
        <SkillsSection />
      </>
    ),
    contact: <ContactSection />,
  }

  return (
    // The heading is the menu word: it's the same word that floats up from the home page.
    // The section's title is for the browser tab.
    // The project rows fade their own parts, since a project's title and image travel from them
    <PageFrame title={navLabel || title} intro={intro} fadeContent={id !== 'projects'}>
      <title>{`${title} | ${content.settings.profile.name}`}</title>
      <meta name="description" content={intro || content.settings.site.description} />
      {body[id]}
    </PageFrame>
  )
}
