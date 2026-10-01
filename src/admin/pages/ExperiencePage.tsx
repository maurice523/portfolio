import { useContent } from '@/content/context'
import { experienceListSchema } from '@/shared/schema'
import { saveCollection } from '../api'
import { useEditor } from '../drafts'
import { EditorPage } from '../EditorPage'
import { buttonClass, Panel, RemoveButton, StringList, TextInput } from '../fields'
import { replaceAt } from '../list'
import { SortableList } from '../SortableList'

export function ExperiencePage() {
  const editor = useEditor({
    id: 'experience',
    saved: useContent().experience,
    schema: experienceListSchema,
    save: (value) => saveCollection('experience', value),
  })
  const { draft: jobs, setDraft: setJobs } = editor

  return (
    <EditorPage
      title="Experience"
      description="Your timeline, top to bottom. Drag roles by their handle to put the newest first."
      editor={editor}
    >
      <SortableList
        items={jobs}
        onChange={setJobs}
        label={(job) => job.role}
        className="flex flex-col gap-5"
      >
        {(job, index, { handle, remove }) => {
          const set = (patch: Partial<typeof job>) =>
            setJobs(replaceAt(jobs, index, { ...job, ...patch }))
          return (
            <Panel
              title={job.role || 'New role'}
              description={job.company}
              handle={handle}
              actions={<RemoveButton label={job.role} onClick={remove} />}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput label="Role" value={job.role} onChange={(role) => set({ role })} />
                <TextInput
                  label="Company"
                  value={job.company}
                  onChange={(company) => set({ company })}
                />
              </div>
              <TextInput
                label="Dates"
                placeholder="Jun 2026 – Aug 2026"
                value={job.date}
                onChange={(date) => set({ date })}
              />
              <StringList
                label="Bullet points"
                items={job.bullets}
                onChange={(bullets) => set({ bullets })}
                addLabel="Add bullet"
              />
            </Panel>
          )
        }}
      </SortableList>
      <button
        type="button"
        className={`${buttonClass} self-start`}
        onClick={() => setJobs([...jobs, { company: '', role: '', date: '', bullets: [] }])}
      >
        + Add role
      </button>
    </EditorPage>
  )
}
