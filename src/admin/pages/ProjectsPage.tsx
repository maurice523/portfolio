import clsx from 'clsx'
import { useState } from 'react'
import { ProjectCard } from '@/components/ProjectCard'
import { useContent } from '@/content/context'
import { projectsSchema, projectStatuses, type Project } from '@/shared/schema'
import { saveCollection } from '../api'
import { useEditor } from '../drafts'
import { EditorPage } from '../EditorPage'
import {
  buttonClass,
  RemoveButton,
  MediaInput,
  Panel,
  Select,
  StringList,
  TextArea,
  TextInput,
  Toggle,
} from '../fields'
import { indexAfterMove, replaceAt } from '../list'
import { SortableList } from '../SortableList'

const statusLabels: Record<Project['status'], string> = {
  live: 'Live',
  'in-development': 'In development',
  completed: 'Completed',
}

const toSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export function ProjectsPage() {
  const editor = useEditor({
    id: 'projects',
    saved: useContent().projects,
    schema: projectsSchema,
    save: (value) => saveCollection('projects', value),
  })
  const { draft: projects, setDraft: setProjects } = editor
  const [selected, setSelected] = useState(0)
  const index = Math.min(selected, projects.length - 1)
  const project = projects[index]

  function addProject() {
    const blank: Project = {
      slug: `new-project-${projects.length + 1}`,
      title: 'New project',
      tagline: '',
      description: '',
      highlights: [],
      image: '',
      imageAlt: '',
      tools: [],
      links: { github: '', live: '' },
      date: '',
      status: 'in-development',
      featured: false,
    }
    setProjects([...projects, blank])
    setSelected(projects.length)
  }

  return (
    <EditorPage
      title="Projects"
      description="Featured projects show first and larger; the rest follow in this order."
      editor={editor}
    >
      <Panel
        title="All projects"
        actions={
          <button type="button" className={buttonClass} onClick={addProject}>
            + Add project
          </button>
        }
      >
        <SortableList
          items={projects}
          onChange={setProjects}
          label={(item) => item.title}
          onMoved={(from, to) => setSelected(indexAfterMove(index, from, to))}
          className="flex flex-col gap-1"
        >
          {(item, i, { handle, remove }) => (
            <div
              className={clsx(
                'flex items-center gap-1 rounded-md pl-1',
                i === index ? 'bg-raised' : 'bg-surface hover:bg-raised/60',
              )}
            >
              {handle}
              <button
                type="button"
                onClick={() => setSelected(i)}
                className="flex min-h-10 flex-1 items-center gap-2 text-left text-sm"
              >
                <span className="font-medium">{item.title || 'Untitled'}</span>
                {item.featured && <span className="text-xs text-accent">Featured</span>}
                <span className="text-xs text-muted">{statusLabels[item.status]}</span>
              </button>
              <RemoveButton label={item.title} onClick={remove} />
            </div>
          )}
        </SortableList>
      </Panel>

      {project && (
        <ProjectEditor
          key={index}
          project={project}
          onChange={(next) => setProjects(replaceAt(projects, index, next))}
        />
      )}
    </EditorPage>
  )
}

function ProjectEditor({
  project,
  onChange,
}: {
  project: Project
  onChange: (project: Project) => void
}) {
  const set = (patch: Partial<Project>) => onChange({ ...project, ...patch })

  return (
    <>
      <Panel title={`Edit “${project.title || 'Untitled'}”`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Title" value={project.title} onChange={(title) => set({ title })} />
          <TextInput
            label="URL slug"
            hint={`Page address: /projects/${project.slug}. Changing it breaks old links.`}
            value={project.slug}
            onChange={(slug) => set({ slug: toSlug(slug) })}
          />
        </div>
        <TextInput
          label="Tagline"
          hint="One line on the card."
          value={project.tagline}
          onChange={(tagline) => set({ tagline })}
        />
        <TextArea
          label="Description"
          hint="On the project page. Leave a blank line between paragraphs."
          rows={8}
          value={project.description}
          onChange={(description) => set({ description })}
        />
        <StringList
          label="Highlights"
          items={project.highlights}
          onChange={(highlights) => set({ highlights })}
          addLabel="Add highlight"
        />
        <StringList
          label="Tools"
          items={project.tools}
          onChange={(tools) => set({ tools })}
          addLabel="Add tool"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Dates"
            placeholder="Aug 2026 – Present"
            value={project.date}
            onChange={(date) => set({ date })}
          />
          <Select
            label="Status"
            value={project.status}
            options={projectStatuses.map((value) => ({ value, label: statusLabels[value] }))}
            onChange={(status) => set({ status })}
          />
        </div>
        <Toggle
          label="Featured"
          hint="Listed first and shown at half width on desktop."
          checked={project.featured}
          onChange={(featured) => set({ featured })}
        />
      </Panel>

      <Panel title="Image & links">
        <MediaInput
          label="Image"
          hint="Screenshots look best around 1600×900. SVG artwork is shown full-bleed."
          value={project.image}
          onChange={(image) => set({ image })}
        />
        <TextInput
          label="Image description (alt text)"
          value={project.imageAlt}
          onChange={(imageAlt) => set({ imageAlt })}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="GitHub URL"
            type="url"
            value={project.links.github}
            onChange={(github) => set({ links: { ...project.links, github } })}
          />
          <TextInput
            label="Live site URL"
            type="url"
            value={project.links.live}
            onChange={(live) => set({ links: { ...project.links, live } })}
          />
        </div>
      </Panel>

      <Panel title="Card preview">
        <div className="max-w-md">
          <ProjectCard project={project} />
        </div>
      </Panel>
    </>
  )
}
