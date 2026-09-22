type SectionHeadingProps = {
  title: string
  /** Small line above the title with a useful fact, e.g. "5 projects · featured first". */
  eyebrow?: string
  /** Optional sentence under the title. */
  intro?: string
}

export function SectionHeading({ title, eyebrow, intro }: SectionHeadingProps) {
  return (
    <div className="mb-6 max-w-2xl md:mb-8">
      {eyebrow && <p className="mb-1.5 font-mono text-xs text-accent md:text-sm">{eyebrow}</p>}
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      {intro && <p className="mt-2 text-muted">{intro}</p>}
    </div>
  )
}
