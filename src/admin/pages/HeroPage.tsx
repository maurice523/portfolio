import { useContent } from '@/content/context'
import { settingsSchemas } from '@/shared/schema'
import { saveSettings } from '../api'
import { useEditor } from '../drafts'
import { EditorPage } from '../EditorPage'
import { Panel, TextArea, TextInput } from '../fields'

export function HeroPage() {
  const editor = useEditor({
    id: 'hero',
    saved: useContent().settings.hero,
    schema: settingsSchemas.hero,
    save: (value) => saveSettings('hero', value),
  })
  const { draft, setDraft } = editor

  return (
    <EditorPage
      title="Home & hero"
      description="The text along the bottom of the home page, next to the bass."
      editor={editor}
    >
      <Panel>
        <TextInput
          label="Small line above the intro"
          value={draft.eyebrow}
          onChange={(eyebrow) => setDraft({ ...draft, eyebrow })}
        />
        <TextInput
          label="Heading"
          hint="Shown large, one word per line where it fits."
          value={draft.heading}
          onChange={(heading) => setDraft({ ...draft, heading })}
        />
        <TextArea
          label="Intro"
          rows={3}
          value={draft.intro}
          onChange={(intro) => setDraft({ ...draft, intro })}
        />
      </Panel>
    </EditorPage>
  )
}
