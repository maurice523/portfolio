import { useContent } from '@/content/context'
import {
  currentlyWorkingModes,
  projectStatuses,
  settingsSchemas,
  type CurrentlyWorkingMode,
  type Project,
} from '@/shared/schema'
import { saveSettings } from '../api'
import { useEditor } from '../drafts'
import { EditorPage } from '../EditorPage'
import { MediaInput, Panel, Select, StringList, TextArea, TextInput } from '../fields'

const modeLabels: Record<CurrentlyWorkingMode, string> = {
  none: 'Nothing (hide it)',
  project: 'One of my projects',
  custom: 'A card of its own',
}

const statusLabels: Record<Project['status'], string> = {
  live: 'Live',
  'in-development': 'In development',
  completed: 'Completed',
}

export function CurrentlyWorkingPage() {
  const { settings, projects } = useContent()
  const editor = useEditor({
    id: 'currently-working',
    saved: settings.currentlyWorking,
    schema: settingsSchemas.currentlyWorking,
    save: (value) => saveSettings('currentlyWorking', value),
  })
  const { draft, setDraft } = editor
  const { mode, custom } = draft
  const setCustom = (patch: Partial<typeof custom>) =>
    setDraft({ ...draft, custom: { ...custom, ...patch } })

  return (
    <EditorPage
      title="Currently working"
      description="What the “Currently Working On” button on the home page opens: a project page, with its back arrow leading home. It’s also the card on the About page."
      editor={editor}
    >
      <Panel title="What I’m working on">
        <Select
          label="Show"
          value={mode}
          options={currentlyWorkingModes.map((value) => ({ value, label: modeLabels[value] }))}
          onChange={(next) => setDraft({ ...draft, mode: next })}
          hint="With nothing picked, the button on the home page and the card on the About page are hidden."
        />

        {mode === 'project' && (
          <Select
            label="Project"
            value={draft.slug}
            options={[
              { value: '', label: 'Pick a project…' },
              ...projects.map((project) => ({ value: project.slug, label: project.title })),
            ]}
            onChange={(slug) => setDraft({ ...draft, slug })}
            hint="The button opens this project’s page (the same one as under Projects), with the back arrow leading home. Edit the project itself under Projects."
          />
        )}

        {mode !== 'none' && (
          <TextArea
            label="Blurb"
            rows={2}
            value={draft.blurb}
            onChange={(blurb) => setDraft({ ...draft, blurb })}
            hint="The line on the About page’s card."
          />
        )}
      </Panel>

      {mode === 'custom' && (
        <>
          <Panel
            title="Your card"
            description="A project page made just for this button, for something that isn’t one of your projects yet. It looks like any project’s page, but isn’t listed under Projects."
          >
            <TextInput
              label="Title"
              value={custom.title}
              onChange={(title) => setCustom({ title })}
            />
            <TextInput
              label="Tagline"
              hint="One line on the card."
              value={custom.tagline}
              onChange={(tagline) => setCustom({ tagline })}
            />
            <TextArea
              label="Description"
              hint="Leave a blank line between paragraphs."
              rows={6}
              value={custom.description}
              onChange={(description) => setCustom({ description })}
            />
            <StringList
              label="Highlights"
              items={custom.highlights}
              onChange={(highlights) => setCustom({ highlights })}
              addLabel="Add highlight"
            />
            <StringList
              label="Tools"
              items={custom.tools}
              onChange={(tools) => setCustom({ tools })}
              addLabel="Add tool"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                label="Dates"
                placeholder="Nov 2026 – Present"
                value={custom.date}
                onChange={(date) => setCustom({ date })}
              />
              <Select
                label="Status"
                value={custom.status}
                options={projectStatuses.map((value) => ({ value, label: statusLabels[value] }))}
                onChange={(status) => setCustom({ status })}
              />
            </div>
          </Panel>

          <Panel title="Image & links">
            <MediaInput
              label="Image"
              hint="Screenshots look best around 1600×900. SVG artwork is shown full-bleed."
              value={custom.image}
              onChange={(image) => setCustom({ image })}
            />
            <TextInput
              label="Image description (alt text)"
              value={custom.imageAlt}
              onChange={(imageAlt) => setCustom({ imageAlt })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                label="GitHub URL"
                type="url"
                value={custom.links.github}
                onChange={(github) => setCustom({ links: { ...custom.links, github } })}
              />
              <TextInput
                label="Live site URL"
                type="url"
                value={custom.links.live}
                onChange={(live) => setCustom({ links: { ...custom.links, live } })}
              />
            </div>
          </Panel>
        </>
      )}
    </EditorPage>
  )
}
