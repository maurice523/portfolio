import { AboutSection } from '@/components/AboutSection'
import { ContactSection } from '@/components/ContactSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { Hero } from '@/components/Hero'
import { ProjectGrid } from '@/components/ProjectGrid'
import { Section } from '@/components/Section'
import { SkillsSection } from '@/components/SkillsSection'
import { getProjects } from '@/data/projects'

export function HomePage() {
  const projects = getProjects()

  return (
    <main>
      <Hero />

      <Section
        id="projects"
        title="Projects"
        eyebrow={`${projects.length} projects · featured first`}
        intro="Things I’ve built, from internship tools to side projects."
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
