// Helpers for editing lists immutably (React state must not be changed in place).

/** Moves an item in a list, e.g. after a drag-and-drop. */
export function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

/** Returns a copy of the list with item `index` replaced. */
export function replaceAt<T>(list: T[], index: number, item: T): T[] {
  return list.map((current, i) => (i === index ? item : current))
}

/** Where a selected row ends up after another (or the same) row moves from `from` to `to`. */
export function indexAfterMove(selected: number, from: number, to: number): number {
  if (selected === from) return to
  if (from < selected && selected <= to) return selected - 1
  if (to <= selected && selected < from) return selected + 1
  return selected
}
