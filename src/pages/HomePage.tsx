import { AboutSection } from '@/components/AboutSection'
import { ContactSection } from '@/components/ContactSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { Hero } from '@/components/Hero'
import { ProjectGrid } from '@/components/ProjectGrid'
import { Section } from '@/components/Section'
import { SkillsSection } from '@/components/SkillsSection'
import { useContent } from '@/content/context'

export function HomePage() {
  const content = useContent()
  const copy = content.settings.sections.projects
  // Featured first; otherwise in the order set in /admin.
  const projects = [...content.projects].sort((a, b) => Number(b.featured) - Number(a.featured))

  return (
    <main>
      <Hero />

      <Section
        id="projects"
        title={copy.title}
        eyebrow={`${projects.length} projects · featured first`}
        intro={copy.intro}
      >
        <ProjectGrid projects={projects} />
      </Section>

      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <ContactSection />
    </main>
  )
}
