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
  skills: 'Skills (part of the About page)',
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
      description="Each page’s name in the home page menu (the big words next to the bass), which is also the page’s heading, plus its browser tab title and intro."
      editor={editor}
    >
      {(Object.keys(sectionNames) as SectionId[]).map((id) => {
        const section = draft[id]
        const set = (patch: Partial<typeof section>) =>
          setDraft({ ...draft, [id]: { ...section, ...patch } })
        return (
          <Panel key={id} title={sectionNames[id]}>
            {/* Skills has no page of its own, so nothing to put in the menus */}
            {id !== 'skills' && (
              <TextInput
                label="Menu label"
                hint="Also the page’s heading. Leave empty to leave this page off the home page menu."
                value={section.navLabel}
                onChange={(navLabel) => set({ navLabel })}
              />
            )}
            <TextInput
              label="Title"
              hint={id === 'skills' ? undefined : 'Shown in the browser tab.'}
              value={section.title}
              onChange={(title) => set({ title })}
            />
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
