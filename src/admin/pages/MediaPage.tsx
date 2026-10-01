import { useEffect, useRef, useState } from 'react'
import { deleteMedia, listMedia, uploadMedia, type MediaItem } from '../api'
import { buttonClass, Panel, primaryButtonClass } from '../fields'

const formatSize = (bytes: number) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`

// Files uploaded to the R2 bucket. Changes here happen immediately (no Save button).
export function MediaPage() {
  const [items, setItems] = useState<MediaItem[] | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmKey, setConfirmKey] = useState('')
  const [copied, setCopied] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  const run = async (task: () => Promise<void>) => {
    setError('')
    setBusy(true)
    try {
      await task()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    listMedia()
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
  }, [])

  async function upload(files: FileList) {
    await run(async () => {
      for (const file of Array.from(files)) await uploadMedia(file)
      setItems(await listMedia())
    })
  }

  async function remove(key: string) {
    await run(async () => {
      await deleteMedia(key)
      setItems((current) => current?.filter((item) => item.key !== key) ?? null)
      setConfirmKey('')
    })
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(url)
    setCopied(url)
  }

  return (
    <div className="flex flex-col gap-5">
      <title>Media library | Admin</title>
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Media library</h1>
        <p className="mt-1 text-muted">
          Images and files stored in your Cloudflare R2 bucket. Uploads and deletions happen right
          away.
        </p>
      </header>

      <Panel
        actions={
          <button
            type="button"
            className={primaryButtonClass}
            disabled={busy}
            onClick={() => fileInput.current?.click()}
          >
            {busy ? 'Working…' : 'Upload files'}
          </button>
        }
        title={items ? `${items.length} files` : 'Loading…'}
        description="PNG, JPEG, WebP, GIF, AVIF, SVG or PDF, up to 10 MB each."
      >
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/*,application/pdf"
          hidden
          onChange={(event) => {
            if (event.target.files?.length) void upload(event.target.files)
            event.target.value = ''
          }}
        />
        {error && <p className="text-sm text-accent">{error}</p>}
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items?.map((item) => (
            <li
              key={item.key}
              className="flex flex-col overflow-hidden rounded-lg border border-line bg-bg"
            >
              <div className="grid aspect-video place-items-center bg-raised">
                {item.type.startsWith('image/') ? (
                  <img src={item.url} alt={item.key} className="size-full object-contain" />
                ) : (
                  <span className="font-mono text-xs text-muted">{item.type}</span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-2">
                <p className="truncate font-mono text-xs" title={item.key}>
                  {item.key}
                </p>
                <p className="text-xs text-muted">{formatSize(item.size)}</p>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  <button type="button" className={buttonClass} onClick={() => copy(item.url)}>
                    {copied === item.url ? 'Copied' : 'Copy URL'}
                  </button>
                  {confirmKey === item.key ? (
                    <button
                      type="button"
                      className={`${buttonClass} border-accent text-accent`}
                      onClick={() => remove(item.key)}
                    >
                      Really delete?
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={buttonClass}
                      onClick={() => setConfirmKey(item.key)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
