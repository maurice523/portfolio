import { motion } from 'motion/react'
import { Fragment, useRef } from 'react'
import { Link } from 'react-router'
import { useContent } from '@/content/context'
import { OrbitingCircles } from './OrbitingCircles'
import { Section } from './Section'

const tile = 'relative overflow-hidden rounded-2xl border border-line bg-surface p-5 md:p-6'

export function AboutSection() {
  const playground = useRef<HTMLDivElement>(null)
  const { settings, projects } = useContent()
  const { profile, about, education, sections } = settings
  const { interests, techStack } = about
  const building = projects.find((project) => project.slug === about.currentlyBuilding.slug)

  return (
    <Section id="about" title={sections.about.title} intro={sections.about.intro}>
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
              <p className="text-lg font-semibold text-fg">{profile.name}</p>
              {about.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Drag playground */}
        <div className={`${tile} min-h-[26rem] md:col-span-2 md:row-span-2 md:min-h-80`}>
          <p className="text-sm font-medium text-muted">{about.playgroundLabel}</p>
          <ul className="sr-only">
            {interests.map((chip) => (
              <li key={chip.text}>{chip.text}</li>
            ))}
          </ul>
          <div ref={playground} aria-hidden="true" className="absolute inset-0 top-10">
            <p className="pointer-events-none absolute inset-0 grid place-items-center text-center text-4xl leading-tight font-semibold text-line select-none">
              {about.playgroundWords.map((word, i) => (
                <Fragment key={word}>
                  {i > 0 && <br />}
                  {word}
                </Fragment>
              ))}
            </p>
            {interests.map((chip) => (
              <motion.div
                key={chip.text}
                drag
                dragConstraints={playground}
                dragElastic={0.4}
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1, zIndex: 10 }}
                style={{
                  top: `${chip.top}%`,
                  left: `${chip.left}%`,
                  rotate: `${chip.rotate}deg`,
                  color: chip.color,
                  borderColor: `color-mix(in srgb, ${chip.color} 45%, transparent)`,
                  // Tinted but opaque, so the faded text behind doesn't show through
                  backgroundColor: `color-mix(in srgb, ${chip.color} 16%, var(--color-surface))`,
                }}
                className="absolute cursor-grab rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap shadow-lg select-none active:cursor-grabbing"
              >
                {chip.text}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education (wider when there's no "Currently building" card next to it) */}
        <div className={`${tile} ${building ? 'md:col-span-2' : 'md:col-span-4'}`}>
          <p className="text-sm font-medium text-muted">Education</p>
          <p className="mt-2 text-lg font-semibold">{education.school}</p>
          <p className="mt-1 text-sm text-muted">{education.degree}</p>
          <ul className="mt-3 flex flex-col gap-1 text-sm">
            {education.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>

        {/* Currently building */}
        {building && (
          <Link
            to={`/projects/${building.slug}`}
            className={`${tile} group flex flex-col justify-between gap-6 hover:border-accent/50 md:col-span-2`}
          >
            <p className="flex items-center gap-2 text-sm font-medium text-muted">
              <span className="size-2 animate-pulse rounded-full bg-amber motion-reduce:animate-none" />
              Currently building
            </p>
            <div>
              <p className="text-2xl font-semibold group-hover:text-accent">{building.title}</p>
              <p className="mt-1 text-sm text-muted">{about.currentlyBuilding.blurb}</p>
            </div>
            <p></p>
          </Link>
        )}

        {/* Tech stack with orbiting logos */}
        <div className={`${tile} grid gap-6 md:col-span-6 md:grid-cols-2 md:items-center`}>
          <div className="max-w-sm">
            <p className="text-lg font-semibold">{techStack.title}</p>
            <p className="mt-2 text-muted">{techStack.text}</p>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[20rem] max-sm:scale-[0.8]">
            <OrbitingCircles icons={techStack.innerRing} radius={70} duration={24} size={40} />
            <OrbitingCircles
              icons={techStack.outerRing}
              radius={140}
              duration={36}
              size={40}
              reverse
            />
          </div>
        </div>
      </div>
    </Section>
  )
}
