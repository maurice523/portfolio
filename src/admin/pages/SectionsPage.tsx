import { useContent } from '@/content/context'
import { settingsSchemas, type SectionId } from '@/shared/schema'
import { saveSettings } from '../api'
import { useEditor } from '../drafts'
import { EditorPage } from '../EditorPage'
import { Panel, TextArea, TextInput } from '../fields'

const sectionNames: Record<SectionId, string> = {
  projects: 'Projects',
  about: 'About',
  experience: 'Experience',
  skills: 'Skills',
  contact: 'Contact',
}

export function SectionsPage() {
  const editor = useEditor({
    id: 'sections',
    saved: useContent().settings.sections,
    schema: settingsSchemas.sections,
    save: (value) => saveSettings('sections', value),
  })
  const { draft, setDraft } = editor

  return (
    <EditorPage
      title="Section titles"
      description="Headings and intros for each part of the home page, and their labels in the top menu."
      editor={editor}
    >
      {(Object.keys(sectionNames) as SectionId[]).map((id) => {
        const section = draft[id]
        const set = (patch: Partial<typeof section>) =>
          setDraft({ ...draft, [id]: { ...section, ...patch } })
        return (
          <Panel key={id} title={sectionNames[id]}>
            <TextInput
              label="Menu label"
              hint="Leave empty to leave this section out of the top menu."
              value={section.navLabel}
              onChange={(navLabel) => set({ navLabel })}
            />
            <TextInput label="Title" value={section.title} onChange={(title) => set({ title })} />
            <TextArea
              label="Intro"
              rows={2}
              value={section.intro}
              onChange={(intro) => set({ intro })}
            />
          </Panel>
        )
      })}
    </EditorPage>
  )
}
