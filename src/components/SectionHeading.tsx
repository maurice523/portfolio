type SectionHeadingProps = {
  title: string
  /** Optional sentence under the title. */
  intro?: string
}

export function SectionHeading({ title, intro }: SectionHeadingProps) {
  return (
    <div className="mb-8 max-w-2xl md:mb-10">
      <h2 className="text-3xl leading-none font-black uppercase [font-stretch:125%] md:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg text-pretty text-muted">{intro}</p>}
    </div>
  )
}
