import { useContent } from '@/content/context'
import { settingsSchemas } from '@/shared/schema'
import { saveSettings } from '../api'
import { useEditor } from '../drafts'
import { EditorPage } from '../EditorPage'
import { buttonClass, Panel, RemoveButton, StringList, TextInput } from '../fields'
import { replaceAt } from '../list'
import { SortableList } from '../SortableList'

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
      <SortableList
        items={groups}
        onChange={setGroups}
        label={(group) => `group ${group.name}`}
        className="flex flex-col gap-5"
      >
        {(group, index, { handle, remove }) => (
          <Panel
            title={group.name || 'New group'}
            handle={handle}
            actions={<RemoveButton label={`group ${group.name}`} onClick={remove} />}
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
        )}
      </SortableList>
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
