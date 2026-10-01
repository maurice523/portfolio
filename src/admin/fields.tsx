// Small form building blocks for the admin pages, styled with the site's own theme colors.
import clsx from 'clsx'
import { useId, useRef, useState, type ReactNode } from 'react'
import { listMedia, uploadMedia, type MediaItem } from './api'
import { replaceAt } from './list'
import { SortableList } from './SortableList'

const inputClass =
  'w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-fg placeholder:text-muted/60 focus:border-accent focus:outline-none'
export const buttonClass =
  'inline-flex min-h-9 items-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium text-fg hover:border-muted disabled:opacity-50'
export const primaryButtonClass =
  'inline-flex min-h-9 items-center gap-1.5 rounded-md bg-accent px-4 text-sm font-medium text-bg hover:bg-accent/90 disabled:opacity-50'
const iconButtonClass =
  'grid size-8 place-items-center rounded-md text-muted hover:bg-raised hover:text-fg'

export function Panel({
  title,
  description,
  children,
  actions,
  handle,
}: {
  title?: string
  description?: string
  children: ReactNode
  actions?: ReactNode
  /** Drag handle, when the panel is a row in a SortableList. */
  handle?: ReactNode
}) {
  return (
    <section className="rounded-xl border border-line bg-surface p-4 md:p-5">
      {(title || actions || handle) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            {handle && <div className="-ml-2">{handle}</div>}
            <div>
              {title && <h2 className="font-semibold">{title}</h2>}
              {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
            </div>
          </div>
          {actions}
        </div>
      )}
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string
  hint?: string
  htmlFor?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}

export function TextInput({
  label,
  value,
  onChange,
  hint,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  placeholder?: string
  type?: 'text' | 'email' | 'url'
}) {
  const id = useId()
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </Field>
  )
}

export function TextArea({
  label,
  value,
  onChange,
  hint,
  rows = 4,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  rows?: number
}) {
  const id = useId()
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={clsx(inputClass, 'resize-y leading-relaxed')}
      />
    </Field>
  )
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  suffix?: string
}) {
  const id = useId()
  return (
    <Field label={suffix ? `${label} (${suffix})` : label} htmlFor={id}>
      <input
        id={id}
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(Number(event.target.value))}
        className={inputClass}
      />
    </Field>
  )
}

export function Select<V extends string>({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string
  value: V
  options: { value: V; label: string }[]
  onChange: (value: V) => void
  hint?: string
}) {
  const id = useId()
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as V)}
        className={inputClass}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  hint?: string
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 accent-(--color-accent)"
      />
      <span>
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  )
}

export function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const id = useId()
  return (
    <Field label={label} htmlFor={id}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#000000'}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-11 shrink-0 cursor-pointer rounded-md border border-line bg-bg p-1"
        />
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={clsx(inputClass, 'font-mono')}
        />
      </div>
    </Field>
  )
}

/** ✕ button that removes a row from a list. Pair it with a SortableList row's drag handle. */
export function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={clsx(iconButtonClass, 'shrink-0 hover:text-accent')}
      onClick={onClick}
      aria-label={`Remove ${label || 'item'}`}
      title="Remove"
    >
      ✕
    </button>
  )
}

/** An editable list of short texts (bullets, tools, paragraphs...). */
export function StringList({
  label,
  items,
  onChange,
  multiline,
  addLabel = 'Add',
  hint,
}: {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  multiline?: boolean
  addLabel?: string
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">{label}</p>
      {hint && <p className="-mt-1 text-xs text-muted">{hint}</p>}
      <SortableList
        items={items}
        onChange={onChange}
        label={(item, index) => item || `${label} ${index + 1}`}
      >
        {(item, index, { handle, remove }) => (
          <div className="flex items-start gap-1">
            {handle}
            {multiline ? (
              <textarea
                aria-label={`${label} ${index + 1}`}
                rows={3}
                value={item}
                onChange={(event) => onChange(replaceAt(items, index, event.target.value))}
                className={clsx(inputClass, 'resize-y leading-relaxed')}
              />
            ) : (
              <input
                aria-label={`${label} ${index + 1}`}
                value={item}
                onChange={(event) => onChange(replaceAt(items, index, event.target.value))}
                className={inputClass}
              />
            )}
            <RemoveButton label={`${label} ${index + 1}`} onClick={remove} />
          </div>
        )}
      </SortableList>
      <button
        type="button"
        className={clsx(buttonClass, 'self-start')}
        onClick={() => onChange([...items, ''])}
      >
        + {addLabel}
      </button>
    </div>
  )
}

/**
 * A file/image URL with an upload button and a picker for files already uploaded to R2.
 * Paths like /projects/move.svg (files in the repo's public/ folder) work too.
 */
export function MediaInput({
  label,
  value,
  onChange,
  hint,
  accept = 'image/*',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  accept?: string
}) {
  const id = useId()
  const fileInput = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [library, setLibrary] = useState<MediaItem[] | null>(null)
  const isImage = accept.startsWith('image')

  async function upload(file: File) {
    setBusy(true)
    setError('')
    try {
      onChange((await uploadMedia(file)).url)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  async function toggleLibrary() {
    if (library) return setLibrary(null)
    setError('')
    try {
      setLibrary(await listMedia())
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const choices = library?.filter((item) => (isImage ? item.type.startsWith('image/') : true))

  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <div className="flex items-start gap-3">
        {isImage && (
          <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-md border border-line bg-bg">
            {value ? (
              <img src={value} alt="" className="size-full object-cover" />
            ) : (
              <span className="text-xs text-muted">None</span>
            )}
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            id={id}
            value={value}
            placeholder="/media/… or https://…"
            onChange={(event) => onChange(event.target.value)}
            className={clsx(inputClass, 'font-mono')}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={buttonClass}
              disabled={busy}
              onClick={() => fileInput.current?.click()}
            >
              {busy ? 'Uploading…' : 'Upload'}
            </button>
            <button type="button" className={buttonClass} onClick={toggleLibrary}>
              {library ? 'Close library' : 'Choose uploaded'}
            </button>
            {value && (
              <button type="button" className={buttonClass} onClick={() => onChange('')}>
                Clear
              </button>
            )}
          </div>
          <input
            ref={fileInput}
            type="file"
            accept={accept}
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) void upload(file)
              event.target.value = ''
            }}
          />
          {error && <p className="text-sm text-accent">{error}</p>}
        </div>
      </div>
      {choices && (
        <div className="mt-2 grid grid-cols-4 gap-2 rounded-md border border-line bg-bg p-2 sm:grid-cols-6">
          {choices.length === 0 && (
            <p className="col-span-full p-2 text-sm text-muted">Nothing uploaded yet.</p>
          )}
          {choices.map((item) => (
            <button
              key={item.key}
              type="button"
              title={item.key}
              onClick={() => {
                onChange(item.url)
                setLibrary(null)
              }}
              className="aspect-square overflow-hidden rounded border border-line hover:border-accent"
            >
              {item.type.startsWith('image/') ? (
                <img src={item.url} alt={item.key} className="size-full object-cover" />
              ) : (
                <span className="block truncate p-1 text-xs">{item.key}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </Field>
  )
}
