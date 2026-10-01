import { useContent } from '@/content/context'
import { settingsSchemas, type Logo } from '@/shared/schema'
import { saveSettings } from '../api'
import { useEditor } from '../drafts'
import { EditorPage } from '../EditorPage'
import {
  buttonClass,
  ColorInput,
  MediaInput,
  NumberInput,
  Panel,
  RemoveButton,
  Select,
  StringList,
  TextArea,
  TextInput,
} from '../fields'
import { replaceAt } from '../list'
import { SortableList } from '../SortableList'

export function AboutPage() {
  const { settings, projects } = useContent()
  const editor = useEditor({
    id: 'about',
    saved: settings.about,
    schema: settingsSchemas.about,
    save: (value) => saveSettings('about', value),
  })
  const { draft, setDraft } = editor
  const { interests, techStack, currentlyBuilding } = draft
  const setInterests = (next: typeof interests) => setDraft({ ...draft, interests: next })
  const setTechStack = (patch: Partial<typeof techStack>) =>
    setDraft({ ...draft, techStack: { ...techStack, ...patch } })

  return (
    <EditorPage title="About" description="The bento grid in the About section." editor={editor}>
      <Panel title="Bio">
        <StringList
          label="Paragraphs"
          multiline
          items={draft.bio}
          onChange={(bio) => setDraft({ ...draft, bio })}
          addLabel="Add paragraph"
        />
      </Panel>

      <Panel
        title="Drag playground"
        description="The chips visitors can drag around. Positions are where each chip starts."
      >
        <TextInput
          label="Label"
          value={draft.playgroundLabel}
          onChange={(playgroundLabel) => setDraft({ ...draft, playgroundLabel })}
        />
        <StringList
          label="Background words"
          items={draft.playgroundWords}
          onChange={(playgroundWords) => setDraft({ ...draft, playgroundWords })}
          addLabel="Add word"
        />

        {/* Preview: same positioning as the real playground */}
        <div className="relative mx-auto h-80 w-full max-w-xs overflow-hidden rounded-xl border border-line bg-surface">
          <p className="pointer-events-none absolute inset-0 grid place-items-center text-center text-3xl leading-tight font-semibold text-line">
            {draft.playgroundWords.join(' ')}
          </p>
          {interests.map((chip, index) => (
            <span
              key={index}
              style={{
                top: `${chip.top}%`,
                left: `${chip.left}%`,
                rotate: `${chip.rotate}deg`,
                color: chip.color,
                borderColor: `color-mix(in srgb, ${chip.color} 45%, transparent)`,
                backgroundColor: `color-mix(in srgb, ${chip.color} 16%, var(--color-surface))`,
              }}
              className="absolute rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap"
            >
              {chip.text || '…'}
            </span>
          ))}
        </div>

        <SortableList items={interests} onChange={setInterests} label={(chip) => chip.text}>
          {(chip, index, { handle, remove }) => {
            const set = (patch: Partial<typeof chip>) =>
              setInterests(replaceAt(interests, index, { ...chip, ...patch }))
            return (
              <div className="rounded-lg border border-line bg-surface p-3">
                <div className="mb-3 flex items-center gap-1">
                  <div className="-ml-1.5">{handle}</div>
                  <p className="mr-auto text-sm font-medium" style={{ color: chip.color }}>
                    {chip.text || 'New chip'}
                  </p>
                  <RemoveButton label={chip.text} onClick={remove} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <TextInput label="Text" value={chip.text} onChange={(text) => set({ text })} />
                  <ColorInput
                    label="Color"
                    value={chip.color}
                    onChange={(color) => set({ color })}
                  />
                  <NumberInput
                    label="From top"
                    suffix="%"
                    min={0}
                    max={100}
                    value={chip.top}
                    onChange={(top) => set({ top })}
                  />
                  <NumberInput
                    label="From left"
                    suffix="%"
                    min={0}
                    max={100}
                    value={chip.left}
                    onChange={(left) => set({ left })}
                  />
                  <NumberInput
                    label="Tilt"
                    suffix="°"
                    min={-45}
                    max={45}
                    value={chip.rotate}
                    onChange={(rotate) => set({ rotate })}
                  />
                </div>
              </div>
            )
          }}
        </SortableList>
        <button
          type="button"
          className={`${buttonClass} self-start`}
          onClick={() =>
            setInterests([
              ...interests,
              { text: '', color: '#ff6a1f', top: 40, left: 30, rotate: 0 },
            ])
          }
        >
          + Add chip
        </button>
      </Panel>

      <Panel title="Currently building">
        <Select
          label="Project"
          value={currentlyBuilding.slug}
          options={[
            { value: '', label: 'None (hide this card)' },
            ...projects.map((project) => ({ value: project.slug, label: project.title })),
          ]}
          onChange={(slug) =>
            setDraft({ ...draft, currentlyBuilding: { ...currentlyBuilding, slug } })
          }
        />
        <TextArea
          label="Blurb"
          rows={2}
          value={currentlyBuilding.blurb}
          onChange={(blurb) =>
            setDraft({ ...draft, currentlyBuilding: { ...currentlyBuilding, blurb } })
          }
        />
      </Panel>

      <Panel title="Tech stack" description="The card with orbiting logos.">
        <TextInput
          label="Title"
          value={techStack.title}
          onChange={(title) => setTechStack({ title })}
        />
        <TextArea
          label="Text"
          rows={2}
          value={techStack.text}
          onChange={(text) => setTechStack({ text })}
        />
        <LogoList
          label="Inner ring"
          logos={techStack.innerRing}
          onChange={(innerRing) => setTechStack({ innerRing })}
        />
        <LogoList
          label="Outer ring"
          logos={techStack.outerRing}
          onChange={(outerRing) => setTechStack({ outerRing })}
        />
      </Panel>
    </EditorPage>
  )
}

function LogoList({
  label,
  logos,
  onChange,
}: {
  label: string
  logos: Logo[]
  onChange: (logos: Logo[]) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">{label}</p>
      <SortableList
        items={logos}
        onChange={onChange}
        label={(logo) => logo.name}
        className="flex flex-col gap-3"
      >
        {(logo, index, { handle, remove }) => (
          <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-3">
            <div className="flex items-end gap-1">
              <div className="-ml-1.5 pb-0.5">{handle}</div>
              <div className="flex-1">
                <TextInput
                  label="Name"
                  value={logo.name}
                  onChange={(name) => onChange(replaceAt(logos, index, { ...logo, name }))}
                />
              </div>
              <div className="pb-0.5">
                <RemoveButton label={logo.name} onClick={remove} />
              </div>
            </div>
            <MediaInput
              label="Logo image"
              value={logo.src}
              onChange={(src) => onChange(replaceAt(logos, index, { ...logo, src }))}
            />
          </div>
        )}
      </SortableList>
      <button
        type="button"
        className={`${buttonClass} self-start`}
        onClick={() => onChange([...logos, { name: '', src: '' }])}
      >
        + Add logo
      </button>
    </div>
  )
}
