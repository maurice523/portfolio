import clsx from 'clsx'
import type { CSSProperties } from 'react'

type OrbitingCirclesProps = {
  /** Logo image paths, spread evenly around the circle. */
  icons: { src: string; name: string }[]
  /** Distance from the center in px. */
  radius: number
  /** Seconds for one full orbit. */
  duration?: number
  /** Orbit counter-clockwise. */
  reverse?: boolean
  /** Logo size in px. */
  size?: number
}

// Logos that travel around a faint ring. Each logo counter-rotates so it stays upright.
export function OrbitingCircles({
  icons,
  radius,
  duration = 30,
  reverse,
  size = 40,
}: OrbitingCirclesProps) {
  return (
    <>
      <div
        aria-hidden="true"
        style={{ width: radius * 2, height: radius * 2 }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-1/2 rounded-full border border-line"
      />
      {icons.map((icon, i) => (
        <div
          key={icon.name}
          style={
            {
              '--angle': `${(360 / icons.length) * i}deg`,
              '--radius': `${radius}px`,
              '--duration': `${duration}s`,
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
            } as CSSProperties
          }
          className={clsx(
            'absolute top-1/2 left-1/2 grid animate-orbit place-items-center rounded-full bg-raised p-2 motion-reduce:[transform:rotate(var(--angle))_translateY(var(--radius))_rotate(calc(var(--angle)*-1))] motion-reduce:animate-none',
            reverse && '[animation-direction:reverse]',
          )}
        >
          <img src={icon.src} alt={icon.name} title={icon.name} className="size-full" />
        </div>
      ))}
    </>
  )
}
