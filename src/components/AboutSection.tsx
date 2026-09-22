import { motion } from 'motion/react'
import { useRef, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { profile } from '@/data/profile'
import { OrbitingCircles } from './OrbitingCircles'
import { Section } from './Section'

// Things visitors can drag around in the "playground" tile. Positions are percentages.
const chips: { text: string; style: CSSProperties; highlight?: boolean }[] = [
  { text: 'Python', style: { top: '8%', left: '6%', rotate: '-8deg' } },
  { text: 'React', style: { top: '14%', left: '58%', rotate: '10deg' } },
  {
    text: '1st place · Data Viz',
    style: { top: '30%', left: '18%', rotate: '4deg' },
    highlight: true,
  },
  { text: 'Bass', style: { top: '46%', left: '62%', rotate: '-14deg' }, highlight: true },
  { text: 'SQL', style: { top: '52%', left: '8%', rotate: '12deg' } },
  { text: '29+ students taught', style: { top: '66%', left: '30%', rotate: '-5deg' } },
  { text: 'TypeScript', style: { top: '80%', left: '4%', rotate: '6deg' } },
  { text: 'Boston', style: { top: '82%', left: '62%', rotate: '-9deg' } },
]

// Tech logos (from Devicon, MIT) orbiting in two rings
const innerRing = ['python', 'typescript', 'react', 'java', 'postgresql'].map((name) => ({
  name,
  src: `/logos/${name}.svg`,
}))
const outerRing = [
  'javascript',
  'nodejs',
  'fastapi',
  'supabase',
  'git',
  'tailwindcss',
  'jupyter',
].map((name) => ({ name, src: `/logos/${name}.svg` }))

const tile = 'relative overflow-hidden rounded-2xl border border-line bg-surface p-5 md:p-6'

export function AboutSection() {
  const playground = useRef<HTMLDivElement>(null)
  const { about, education, languages } = profile

  return (
    <Section id="about" title="About me" intro="A bit about who I am and what I work with.">
      <div className="grid grid-cols-1 gap-4 md:auto-rows-[minmax(15rem,auto)] md:grid-cols-6">
        {/* Bio with photo */}
        <div className={`${tile} md:col-span-4`}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <img
              src={profile.photo}
              alt={`Photo of ${profile.name}`}
              className="size-20 shrink-0 rounded-full border-2 border-line object-cover"
            />
            <div className="flex flex-col gap-3 text-muted">
              <p className="text-lg font-semibold text-fg">Hi, I’m {profile.name}</p>
              {about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Drag playground */}
        <div className={`${tile} min-h-[26rem] md:col-span-2 md:row-span-2 md:min-h-80`}>
          <p className="text-sm font-medium text-muted">Drag things around</p>
          <ul className="sr-only">
            {chips.map((chip) => (
              <li key={chip.text}>{chip.text}</li>
            ))}
          </ul>
          <div ref={playground} aria-hidden="true" className="absolute inset-0 top-10">
            <p className="pointer-events-none absolute inset-0 grid place-items-center text-center text-4xl leading-tight font-semibold text-line select-none">
              code
              <br />
              data
              <br />
              bass
            </p>
            {chips.map((chip) => (
              <motion.div
                key={chip.text}
                drag
                dragConstraints={playground}
                dragElastic={0.4}
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1, zIndex: 10 }}
                style={chip.style}
                className={`absolute cursor-grab rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap shadow-lg select-none active:cursor-grabbing ${
                  chip.highlight
                    ? 'border-accent/40 bg-accent/15 text-accent'
                    : 'border-line bg-raised text-fg'
                }`}
              >
                {chip.text}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className={`${tile} md:col-span-2`}>
          <p className="text-sm font-medium text-muted">Education</p>
          <p className="mt-2 text-lg font-semibold">{education.school}</p>
          <p className="mt-1 text-sm text-muted">{education.degree}</p>
          <p className="mt-1 font-mono text-sm text-muted">{education.date}</p>
          <ul className="mt-3 flex flex-col gap-1 text-sm">
            {education.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>

        {/* Currently building */}
        <Link
          to="/projects/move"
          className={`${tile} group flex flex-col justify-between gap-6 hover:border-accent/50 md:col-span-2`}
        >
          <p className="flex items-center gap-2 text-sm font-medium text-muted">
            <span className="size-2 animate-pulse rounded-full bg-amber motion-reduce:animate-none" />
            Currently building
          </p>
          <div>
            <p className="text-2xl font-semibold group-hover:text-accent">Move</p>
            <p className="mt-1 text-sm text-muted">
              A ridesharing app for students, which I’m co-founding. See the project →
            </p>
          </div>
          <p className="text-sm text-muted">Speaks {languages.join(' · ')}</p>
        </Link>

        {/* Tech stack with orbiting logos */}
        <div className={`${tile} grid gap-6 md:col-span-6 md:grid-cols-2 md:items-center`}>
          <div className="max-w-sm">
            <p className="text-lg font-semibold">Tech stack</p>
            <p className="mt-2 text-muted">
              The languages and tools I reach for most, from data work in Python to full-stack apps
              in TypeScript and React.
            </p>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[20rem] max-sm:scale-[0.8]">
            <OrbitingCircles icons={innerRing} radius={70} duration={24} size={40} />
            <OrbitingCircles icons={outerRing} radius={140} duration={36} size={40} reverse />
          </div>
        </div>
      </div>
    </Section>
  )
}
