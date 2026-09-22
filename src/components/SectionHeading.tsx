type SectionHeadingProps = {
  title: string
  /** Small line above the title with a useful fact, e.g. "5 projects · featured first". */
  eyebrow?: string
  /** Optional sentence under the title. */
  intro?: string
}

export function SectionHeading({ title, eyebrow, intro }: SectionHeadingProps) {
  return (
    <div className="mb-8 max-w-2xl md:mb-12">
      {eyebrow && <p className="mb-2 font-mono text-sm text-accent">{eyebrow}</p>}
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {intro && <p className="mt-3 text-lg text-muted">{intro}</p>}
    </div>
  )
}
