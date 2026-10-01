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
    <EditorPage title="Home & hero" description="The first thing visitors see." editor={editor}>
      <Panel>
        <TextInput
          label="Small line above the heading"
          value={draft.eyebrow}
          onChange={(eyebrow) => setDraft({ ...draft, eyebrow })}
        />
        <TextInput
          label="Heading"
          value={draft.heading}
          onChange={(heading) => setDraft({ ...draft, heading })}
        />
        <TextArea
          label="Intro"
          rows={3}
          value={draft.intro}
          onChange={(intro) => setDraft({ ...draft, intro })}
        />
        <TextInput
          label="Button label"
          hint="The button scrolls to your projects."
          value={draft.ctaLabel}
          onChange={(ctaLabel) => setDraft({ ...draft, ctaLabel })}
        />
      </Panel>
    </EditorPage>
  )
}
