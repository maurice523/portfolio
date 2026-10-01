import { useContent } from '@/content/context'
import { experienceListSchema } from '@/shared/schema'
import { saveCollection } from '../api'
import { useEditor } from '../drafts'
import { EditorPage } from '../EditorPage'
import { buttonClass, ItemControls, Panel, StringList, TextInput } from '../fields'
import { move, replaceAt } from '../list'

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
      description="Your timeline, top to bottom. Put the newest role first."
      editor={editor}
    >
      {jobs.map((job, index) => {
        const set = (patch: Partial<typeof job>) =>
          setJobs(replaceAt(jobs, index, { ...job, ...patch }))
        return (
          <Panel
            key={index}
            title={job.role || 'New role'}
            description={job.company}
            actions={
              <ItemControls
                index={index}
                count={jobs.length}
                label={job.role}
                onMove={(to) => setJobs(move(jobs, index, to))}
                onRemove={() => setJobs(jobs.filter((_, i) => i !== index))}
              />
            }
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
      })}
      <button
        type="button"
        className={`${buttonClass} self-start`}
        onClick={() => setJobs([{ company: '', role: '', date: '', bullets: [] }, ...jobs])}
      >
        + Add role at the top
      </button>
    </EditorPage>
  )
}
