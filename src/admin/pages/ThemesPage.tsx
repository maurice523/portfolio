import clsx from 'clsx'
import { useState, type CSSProperties } from 'react'
import { StatusBadge } from '@/components/StatusBadge'
import { ToolChip } from '@/components/ToolChip'
import { useContent } from '@/content/context'
import { colorTokens, themesSchema, type ColorToken, type Theme } from '@/shared/schema'
import { saveCollection } from '../api'
import { useEditor } from '../drafts'
import { EditorPage } from '../EditorPage'
import { buttonClass, ColorInput, ItemControls, Panel, Select, TextInput, Toggle } from '../fields'
import { move, replaceAt } from '../list'

const tokenLabels: Record<ColorToken, string> = {
  bg: 'Page background',
  surface: 'Cards',
  raised: 'Chips & raised areas',
  line: 'Borders',
  fg: 'Text',
  muted: 'Secondary text',
  accent: 'Accent (buttons, links)',
  amber: '“In development” status',
  green: '“Completed” status',
}

const toId = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export function ThemesPage() {
  const editor = useEditor({
    id: 'themes',
    saved: useContent().themes,
    schema: themesSchema,
    save: (value) => saveCollection('themes', value),
  })
  const { draft: themes, setDraft: setThemes } = editor
  const [selected, setSelected] = useState(() =>
    Math.max(
      0,
      themes.findIndex((t) => t.isDefault),
    ),
  )
  const index = Math.min(selected, themes.length - 1)
  const theme = themes[index]

  function addCopy(source: Theme) {
    let id = toId(`${source.name} copy`)
    while (themes.some((t) => t.id === id)) id += '-2'
    setThemes([
      ...themes,
      { ...source, id, name: `${source.name} copy`, isDefault: false, isPublic: false },
    ])
    setSelected(themes.length)
  }

  const setTheme = (patch: Partial<Theme>) =>
    setThemes(replaceAt(themes, index, { ...theme, ...patch }))
  const makeDefault = () => setThemes(themes.map((t, i) => ({ ...t, isDefault: i === index })))

  return (
    <EditorPage
      title="Themes"
      description="Color schemes for the whole site. The default is what new visitors see; public themes appear as swatches in the top menu."
      editor={editor}
    >
      <Panel title="All themes">
        <ul className="flex flex-col gap-1">
          {themes.map((item, i) => (
            <li
              key={i}
              className={clsx(
                'flex items-center gap-2 rounded-md pl-3',
                i === index ? 'bg-raised' : 'hover:bg-raised/60',
              )}
            >
              <button
                type="button"
                onClick={() => setSelected(i)}
                className="flex min-h-10 flex-1 items-center gap-3 text-left text-sm"
              >
                <span className="flex">
                  {(['bg', 'surface', 'accent'] as const).map((token) => (
                    <span
                      key={token}
                      style={{ backgroundColor: item.colors[token] }}
                      className="-mr-1 size-4 rounded-full border border-line"
                    />
                  ))}
                </span>
                <span className="font-medium">{item.name || 'Untitled'}</span>
                {item.isDefault && <span className="text-xs text-accent">Default</span>}
                {item.isPublic && !item.isDefault && (
                  <span className="text-xs text-muted">Public</span>
                )}
              </button>
              <ItemControls
                index={i}
                count={themes.length}
                label={item.name}
                onMove={(to) => {
                  setThemes(move(themes, i, to))
                  if (i === index) setSelected(to)
                }}
                onRemove={() => !item.isDefault && setThemes(themes.filter((_, j) => j !== i))}
              />
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted">
          The default theme can’t be removed. Make another theme the default first.
        </p>
      </Panel>

      {theme && (
        <div className="grid gap-5 lg:grid-cols-[1fr_minmax(0,20rem)]">
          <Panel
            title={`Edit “${theme.name}”`}
            actions={
              <button type="button" className={buttonClass} onClick={() => addCopy(theme)}>
                Duplicate
              </button>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput label="Name" value={theme.name} onChange={(name) => setTheme({ name })} />
              <Select
                label="Mode"
                value={theme.scheme}
                options={[
                  { value: 'dark', label: 'Dark' },
                  { value: 'light', label: 'Light' },
                ]}
                onChange={(scheme) => setTheme({ scheme })}
              />
            </div>
            <Toggle
              label="Default theme"
              hint="What new visitors see."
              checked={theme.isDefault}
              onChange={(checked) => checked && makeDefault()}
            />
            <Toggle
              label="Public"
              hint="Visitors can switch to it from the menu. The switcher appears once two or more themes are available."
              checked={theme.isPublic}
              onChange={(isPublic) => setTheme({ isPublic })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {colorTokens.map((token) => (
                <ColorInput
                  key={token}
                  label={tokenLabels[token]}
                  value={theme.colors[token]}
                  onChange={(value) => setTheme({ colors: { ...theme.colors, [token]: value } })}
                />
              ))}
            </div>
          </Panel>
          <ThemePreview theme={theme} />
        </div>
      )}
    </EditorPage>
  )
}

// Real site components, re-colored by overriding the theme variables on a wrapper.
function ThemePreview({ theme }: { theme: Theme }) {
  const vars = Object.fromEntries(
    colorTokens.map((token) => [`--color-${token}`, theme.colors[token]]),
  )
  return (
    <div className="lg:sticky lg:top-6 lg:self-start">
      <p className="mb-2 text-sm font-medium">Preview</p>
      <div
        style={{ ...vars, colorScheme: theme.scheme } as CSSProperties}
        className="flex flex-col gap-4 rounded-xl border border-line bg-bg p-5 text-fg"
      >
        <p className="text-sm font-medium text-accent">Small accent line</p>
        <p className="text-2xl font-semibold tracking-tight">Hi, I’m a heading.</p>
        <p className="text-muted">Secondary text looks like this, for intros and descriptions.</p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex min-h-9 items-center rounded-lg bg-accent px-4 text-sm font-medium text-bg">
            Button
          </span>
          <span className="inline-flex min-h-9 items-center rounded-lg border border-line px-4 text-sm font-medium">
            Outline
          </span>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <StatusBadge status="live" />
            <StatusBadge status="in-development" />
            <StatusBadge status="completed" />
          </div>
          <p className="font-semibold">A project card</p>
          <ul className="flex flex-wrap gap-2">
            <ToolChip name="React" />
            <ToolChip name="Python" />
          </ul>
        </div>
      </div>
    </div>
  )
}
