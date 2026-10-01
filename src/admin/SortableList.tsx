// A list you can reorder by dragging rows by their grip handle (⋮⋮), using dnd-kit.
// Works with a mouse, touch, and the keyboard (focus a handle, Space to pick up, arrows to move,
// Space to drop). Reordering only changes the draft; nothing is saved until you click Save.
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
} from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import clsx from 'clsx'
import { useState, type ReactNode } from 'react'
import { move } from './list'

export type RowControls = {
  /** The grip to drag this row by. Place it anywhere in the row. */
  handle: ReactNode
  /** Removes this row from the list. */
  remove: () => void
}

let nextId = 0
const newId = () => `row-${nextId++}`

/**
 * dnd-kit needs an ID per row that stays the same while rows move around. The items are plain
 * content (often re-created on every edit), so the IDs are kept here, alongside the list.
 * Rows added at the end get new IDs; rows removed from the end lose theirs.
 */
function syncIds(ids: string[], length: number): string[] {
  if (ids.length === length) return ids
  if (ids.length > length) return ids.slice(0, length)
  return [...ids, ...Array.from({ length: length - ids.length }, newId)]
}

export function SortableList<T>({
  items,
  onChange,
  label,
  children,
  onMoved,
  className = 'flex flex-col gap-2',
}: {
  items: T[]
  onChange: (items: T[]) => void
  /** Short name for a row, read out by screen readers, e.g. the project title. */
  label: (item: T, index: number) => string
  children: (item: T, index: number, controls: RowControls) => ReactNode
  /** Called after a drag moves a row, e.g. to keep a selection on the moved row. */
  onMoved?: (from: number, to: number) => void
  className?: string
}) {
  const [storedIds, setIds] = useState(() => syncIds([], items.length))
  // When rows are added or removed outside this component, adjust the IDs during render.
  const ids = syncIds(storedIds, items.length)
  if (ids !== storedIds) setIds(ids)
  const sensors = useSensors(
    // A few pixels of movement before a drag starts, so clicking the handle doesn't drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    const from = ids.indexOf(String(active.id))
    const to = ids.indexOf(String(over.id))
    if (from < 0 || to < 0) return
    setIds(move(ids, from, to))
    onChange(move(items, from, to))
    onMoved?.(from, to)
  }

  // What screen readers hear while dragging, e.g. "Boston Trees moved to position 2 of 5."
  const nameOf = (id: string | number) => {
    const index = ids.indexOf(String(id))
    return index < 0 ? 'Item' : label(items[index], index) || `Item ${index + 1}`
  }
  const positionOf = (id: string | number) =>
    `position ${ids.indexOf(String(id)) + 1} of ${ids.length}`
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${nameOf(active.id)}, at ${positionOf(active.id)}.`,
    onDragOver: ({ active, over }) =>
      over ? `${nameOf(active.id)} moved to ${positionOf(over.id)}.` : undefined,
    onDragEnd: ({ active, over }) =>
      over
        ? `${nameOf(active.id)} dropped at ${positionOf(over.id)}.`
        : `${nameOf(active.id)} dropped.`,
    onDragCancel: ({ active }) => `Reordering cancelled. ${nameOf(active.id)} was not moved.`,
  }

  function remove(index: number) {
    setIds(ids.filter((_, i) => i !== index))
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
      accessibility={{
        announcements,
        screenReaderInstructions: {
          draggable:
            'To reorder, press Space to pick up this item, use the arrow keys to move it, then press Space again to drop it, or Escape to cancel.',
        },
      }}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item, index) => (
            <SortableRow key={ids[index]} id={ids[index]} label={label(item, index)}>
              {(handle) => children(item, index, { handle, remove: () => remove(index) })}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

function SortableRow({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: (handle: ReactNode) => ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      aria-label={`Drag to reorder ${label || 'item'}`}
      title="Drag to reorder"
      className="grid size-8 shrink-0 cursor-grab touch-none place-items-center rounded-md text-muted hover:bg-raised hover:text-fg active:cursor-grabbing"
    >
      <svg viewBox="0 0 10 16" aria-hidden="true" className="h-4 w-2.5 fill-current">
        {[2, 8, 14].flatMap((y) => [
          <circle key={`l${y}`} cx="2" cy={y} r="1.5" />,
          <circle key={`r${y}`} cx="8" cy={y} r="1.5" />,
        ])}
      </svg>
    </button>
  )

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={clsx('relative', isDragging && 'z-10 opacity-80 shadow-xl shadow-black/30')}
    >
      {children(handle)}
    </div>
  )
}
