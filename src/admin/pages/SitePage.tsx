import { useContent } from '@/content/context'
import { settingsSchemas } from '@/shared/schema'
import { saveSettings } from '../api'
import { useEditor } from '../drafts'
import { EditorPage } from '../EditorPage'
import { Panel, TextArea, TextInput } from '../fields'

export function SitePage() {
  const editor = useEditor({
    id: 'site',
    saved: useContent().settings.site,
    schema: settingsSchemas.site,
    save: (value) => saveSettings('site', value),
  })
  const { draft, setDraft } = editor

  return (
    <EditorPage
      title="Site & SEO"
      description="How the site appears in browser tabs and search results."
      editor={editor}
    >
      <Panel>
        <TextInput
          label="Browser tab title"
          value={draft.title}
          onChange={(title) => setDraft({ ...draft, title })}
        />
        <TextArea
          label="Search description"
          hint="Shown under your site's name in Google. Aim for under 160 characters."
          rows={3}
          value={draft.description}
          onChange={(description) => setDraft({ ...draft, description })}
        />
        <TextInput
          label="Footer note"
          hint="Shown after “© year Your Name ·” in the footer."
          value={draft.footerNote}
          onChange={(footerNote) => setDraft({ ...draft, footerNote })}
        />
      </Panel>
    </EditorPage>
  )
}
