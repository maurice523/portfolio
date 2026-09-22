// A small tag for a tool or technology, e.g. "React" or "Python".
export function ToolChip({ name }: { name: string }) {
  return (
    <li className="rounded-full bg-raised px-2.5 py-1 font-mono text-[0.8125rem] leading-none text-fg/85">
      {name}
    </li>
  )
}
