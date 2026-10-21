// A small tag for a tool or technology, e.g. "React" or "Python".
export function ToolChip({ name }: { name: string }) {
  return (
    <li className="rounded-md bg-raised px-2 py-1.5 text-[0.8125rem] leading-none font-medium text-fg/80">
      {name}
    </li>
  )
}
