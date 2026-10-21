type SectionHeadingProps = {
  title: string
  /** Optional sentence under the title. */
  intro?: string
}

export function SectionHeading({ title, intro }: SectionHeadingProps) {
  return (
    <div className="mb-8 max-w-2xl md:mb-12">
      <h2 className="text-4xl leading-none font-bold tracking-[-0.03em] [font-stretch:82%] md:text-6xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg text-pretty text-muted">{intro}</p>}
    </div>
  )
}
