import clsx from 'clsx'
import { useThemeChoice } from '@/content/useThemeChoice'

// Color swatches for switching themes. Hidden unless /admin marks more than one theme public.
export function ThemePicker({ className }: { className?: string }) {
  const { themes, current, choose } = useThemeChoice()
  if (themes.length < 2) return null

  return (
    <div role="group" aria-label="Color theme" className={clsx('flex items-center', className)}>
      {themes.map((theme) => (
        <button
          key={theme.id}
          type="button"
          onClick={() => choose(theme.id)}
          aria-pressed={current === theme.id}
          aria-label={`${theme.name} theme`}
          title={theme.name}
          className="group grid size-11 place-items-center rounded-md"
        >
          <span
            aria-hidden="true"
            style={{ backgroundColor: theme.colors.bg, borderColor: theme.colors.accent }}
            className={clsx(
              'grid size-5 place-items-center rounded-full border-2 transition group-hover:scale-110 motion-reduce:transition-none',
              current === theme.id && 'ring-2 ring-fg ring-offset-2 ring-offset-bg',
            )}
          >
            <span
              style={{ backgroundColor: theme.colors.accent }}
              className="size-2 rounded-full"
            />
          </span>
        </button>
      ))}
    </div>
  )
}
