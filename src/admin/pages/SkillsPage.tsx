import { useContent } from '@/content/context'
import { settingsSchemas } from '@/shared/schema'
import { saveSettings } from '../api'
import { useEditor } from '../drafts'
import { EditorPage } from '../EditorPage'
import { buttonClass, ItemControls, Panel, StringList, TextInput } from '../fields'
import { move, replaceAt } from '../list'

export function SkillsPage() {
  const editor = useEditor({
    id: 'skills',
    saved: useContent().settings.skills,
    schema: settingsSchemas.skills,
    save: (value) => saveSettings('skills', value),
  })
  const { draft, setDraft } = editor
  const groups = draft.groups
  const setGroups = (next: typeof groups) => setDraft({ groups: next })

  return (
    <EditorPage title="Skills" description="Grouped tools and technologies." editor={editor}>
      {groups.map((group, index) => (
        <Panel
          key={index}
          title={group.name || 'New group'}
          actions={
            <ItemControls
              index={index}
              count={groups.length}
              label={`group ${group.name}`}
              onMove={(to) => setGroups(move(groups, index, to))}
              onRemove={() => setGroups(groups.filter((_, i) => i !== index))}
            />
          }
        >
          <TextInput
            label="Group name"
            value={group.name}
            onChange={(name) => setGroups(replaceAt(groups, index, { ...group, name }))}
          />
          <StringList
            label="Skills"
            items={group.items}
            onChange={(items) => setGroups(replaceAt(groups, index, { ...group, items }))}
            addLabel="Add skill"
          />
        </Panel>
      ))}
      <button
        type="button"
        className={`${buttonClass} self-start`}
        onClick={() => setGroups([...groups, { name: '', items: [] }])}
      >
        + Add group
      </button>
    </EditorPage>
  )
}
