import { Container } from '@/components/Container'
import { ProjectGrid } from '@/components/ProjectGrid'
import { Section } from '@/components/Section'
import { getProjects } from '@/data/projects'
import { profile } from '@/data/profile'

export function HomePage() {
  const projects = getProjects()

  return (
    <main>
      {/* Temporary intro; the full Hero comes in a later phase */}
      <Container>
        <div className="max-w-3xl pt-20 pb-4 md:pt-32">
          <p className="text-muted font-mono text-sm">
            <span className="text-accent">~/boston $</span> whoami
            <span
              aria-hidden="true"
              className="bg-accent ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse motion-reduce:animate-none"
            />
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">{profile.name}</h1>
          <p className="text-muted mt-5 text-xl md:text-2xl">{profile.headline}</p>
        </div>
      </Container>

      <Section
        id="projects"
        title="Projects"
        eyebrow={`${projects.length} projects · featured first`}
        intro="Things I’ve built, from internship tools to side projects."
      >
        <ProjectGrid projects={projects} />
      </Section>
    </main>
  )
}
