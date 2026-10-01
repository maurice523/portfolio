import { useContent } from '@/content/context'
import { settingsSchemas } from '@/shared/schema'
import { saveSettings } from '../api'
import { useEditor } from '../drafts'
import { EditorPage } from '../EditorPage'
import { Panel, StringList, TextInput } from '../fields'

export function EducationPage() {
  const editor = useEditor({
    id: 'education',
    saved: useContent().settings.education,
    schema: settingsSchemas.education,
    save: (value) => saveSettings('education', value),
  })
  const { draft, setDraft } = editor

  return (
    <EditorPage
      title="Education"
      description="The Education card in the About section."
      editor={editor}
    >
      <Panel>
        <TextInput
          label="School"
          value={draft.school}
          onChange={(school) => setDraft({ ...draft, school })}
        />
        <TextInput
          label="Degree"
          value={draft.degree}
          onChange={(degree) => setDraft({ ...draft, degree })}
        />
        <TextInput
          label="Date"
          value={draft.date}
          onChange={(date) => setDraft({ ...draft, date })}
        />
        <StringList
          label="Details"
          items={draft.details}
          onChange={(details) => setDraft({ ...draft, details })}
          addLabel="Add detail"
        />
      </Panel>
    </EditorPage>
  )
}
