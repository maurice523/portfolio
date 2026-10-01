import type { ReactNode } from 'react'
import type { Editor } from './drafts'
import { buttonClass, primaryButtonClass } from './fields'

// Frame for one admin page: heading, the form, and a save bar pinned to the bottom.
export function EditorPage<T>({
  title,
  description,
  editor,
  children,
}: {
  title: string
  description?: string
  editor: Editor<T>
  children: ReactNode
}) {
  const { dirty, discard, submit, status } = editor

  return (
    <div className="flex flex-col gap-5 pb-24">
      <title>{`${title} | Admin`}</title>
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-muted">{description}</p>}
      </header>

      {children}

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface/95 backdrop-blur md:left-60">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3 px-4 py-3 md:px-8">
          <p className="mr-auto min-w-0 text-sm whitespace-pre-line" role="status">
            {status.kind === 'error' ? (
              <span className="text-accent">{status.message}</span>
            ) : status.kind === 'saving' ? (
              <span className="text-muted">Saving…</span>
            ) : status.kind === 'saved' && !dirty ? (
              <span className="text-green">Saved. It's live on the site.</span>
            ) : dirty ? (
              <span className="text-amber">Unsaved changes</span>
            ) : (
              <span className="text-muted">All changes saved</span>
            )}
          </p>
          <button type="button" className={buttonClass} disabled={!dirty} onClick={discard}>
            Discard
          </button>
          <button
            type="button"
            className={primaryButtonClass}
            disabled={!dirty || status.kind === 'saving'}
            onClick={submit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
