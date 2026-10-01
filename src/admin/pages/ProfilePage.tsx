import { useContent } from '@/content/context'
import { settingsSchemas } from '@/shared/schema'
import { saveSettings } from '../api'
import { useEditor } from '../drafts'
import { EditorPage } from '../EditorPage'
import { MediaInput, Panel, StringList, TextInput } from '../fields'

export function ProfilePage() {
  const editor = useEditor({
    id: 'profile',
    saved: useContent().settings.profile,
    schema: settingsSchemas.profile,
    save: (value) => saveSettings('profile', value),
  })
  const { draft, setDraft } = editor
  const setLink = (key: keyof typeof draft.links, value: string) =>
    setDraft({ ...draft, links: { ...draft.links, [key]: value } })

  return (
    <EditorPage title="Profile & links" editor={editor}>
      <Panel title="About you">
        <TextInput
          label="Name"
          value={draft.name}
          onChange={(name) => setDraft({ ...draft, name })}
        />
        <TextInput
          label="Headline"
          value={draft.headline}
          onChange={(headline) => setDraft({ ...draft, headline })}
        />
        <TextInput
          label="Location"
          value={draft.location}
          onChange={(location) => setDraft({ ...draft, location })}
        />
        <TextInput
          label="Email"
          type="email"
          hint="Shown on the site and used by the email buttons."
          value={draft.email}
          onChange={(email) => setDraft({ ...draft, email })}
        />
        <MediaInput
          label="Photo"
          value={draft.photo}
          onChange={(photo) => setDraft({ ...draft, photo })}
        />
        <StringList
          label="Languages"
          items={draft.languages}
          onChange={(languages) => setDraft({ ...draft, languages })}
          addLabel="Add language"
        />
      </Panel>
      <Panel title="Links" description="Leave a link empty to hide its button.">
        <TextInput
          label="GitHub"
          type="url"
          value={draft.links.github}
          onChange={(value) => setLink('github', value)}
        />
        <TextInput
          label="LinkedIn"
          type="url"
          value={draft.links.linkedin}
          onChange={(value) => setLink('linkedin', value)}
        />
        <MediaInput
          label="Resume (PDF)"
          accept="application/pdf"
          hint="Shows a “Download resume” button in the Contact section. Remove your phone number first."
          value={draft.links.resume}
          onChange={(value) => setLink('resume', value)}
        />
      </Panel>
    </EditorPage>
  )
}
