import { useEffect, useRef, useSyncExternalStore, type PointerEvent } from 'react'

// A playable photo of a Lake Placid Blue Jazz Bass. The photo (public/bass.webp) has no
// strings; they're drawn on top so they can vibrate. It lies down (body left, headstock right)
// on wide screens, and the same picture is rotated to stand upright on narrow ones.
// Click a spot on the neck to play that fret, or drag across the strings to strum.

const IMAGE = '/bass.webp'
// Everything below is in the photo's own pixels (1800 × 600), measured from the image
const W = 1800
const H = 600
const CROP_TOP = 30 // transparent margin above and below the bass that isn't shown
const CROP_HEIGHT = 540
const BRIDGE_X = 105 // where the strings rest on the bridge saddles
const NUT_X = 1430
const BOARD_START = 509 // body end of the fretboard; clicks past it play the open string
/** Frets 1 to 21, nut to body. They follow equal temperament: each gap is 2^(-1/12) of the last. */
const frets = [
  1356, 1292, 1232, 1173, 1118, 1064, 1015, 968, 922, 878, 836, 798, 760, 724, 692, 661, 630, 603,
  576, 550, 526,
]
const SEGMENTS = 48
const DECAY = 2.2 // how fast a vibration dies out, per second

// Top to bottom when the bass lies with its headstock to the right, as seen from the front
const strings = [
  { note: 'E', freq: 41.2, width: 3.6, bridgeY: 246, nutY: 267.6, post: [1506, 266], wobble: 6 },
  { note: 'A', freq: 55.0, width: 3.1, bridgeY: 281, nutY: 285.5, post: [1578, 282], wobble: 7 },
  { note: 'D', freq: 73.42, width: 2.6, bridgeY: 316, nutY: 303.5, post: [1652, 297], wobble: 8 },
  { note: 'G', freq: 98.0, width: 2.1, bridgeY: 351, nutY: 321.4, post: [1722, 312], wobble: 9 },
] as const

/** Height of string i at a point x along the neck (strings fan out toward the bridge). */
const stringY = (i: number, x: number) =>
  strings[i].bridgeY +
  ((strings[i].nutY - strings[i].bridgeY) * (x - BRIDGE_X)) / (NUT_X - BRIDGE_X)

/** The fret a press at x lands on; 0 (open string) over the body or the headstock. */
function fretAt(x: number) {
  if (x >= NUT_X || x < BOARD_START) return 0
  return Math.min(1 + frets.filter((fx) => fx > x).length, frets.length)
}

const fretX = (fret: number) => (fret ? frets[fret - 1] : NUT_X)

type Vibration = {
  amp: number
  start: number
  /** The string vibrates between the bridge and this x (the fret, or the nut when open). */
  stopX: number
  /** Where the fingertip dot sits, just behind the fret; null for an open string. */
  fingerX: number | null
  /** Strength of the first three harmonics, from where along the string it was plucked. */
  modes: [number, number, number]
  /** Visual wobble speed, higher for higher notes. */
  speed: number
}

function modesAt(p: number): [number, number, number] {
  const c = [1, 2, 3].map((n) => Math.sin(n * Math.PI * p) / (n * n))
  const max = Math.max(...c.map(Math.abs)) || 1
  return [c[0] / max, c[1] / max, c[2] / max]
}

/**
 * A plucked-string sound made with the Karplus-Strong algorithm: a burst of noise loops
 * through a short delay line and is averaged a little each pass, which turns it into a
 * decaying tone at the delay line's pitch.
 */
function pluckBuffer(ctx: AudioContext, freq: number): AudioBuffer {
  const rate = ctx.sampleRate
  const length = Math.floor(rate * 2.4)
  const buffer = ctx.createBuffer(1, length, rate)
  const out = buffer.getChannelData(0)
  const period = Math.round(rate / freq)
  const line = Float32Array.from({ length: period }, () => Math.random() * 2 - 1)
  for (let i = 0; i < length; i++) {
    const j = i % period
    out[i] = line[j]
    line[j] = 0.996 * 0.5 * (line[j] + line[(j + 1) % period])
  }
  // Short fade at the end so it never clicks
  const fade = Math.floor(rate * 0.15)
  for (let i = 0; i < fade; i++) out[length - 1 - i] *= i / fade
  return buffer
}

// Upright on phones and tablets, lying down from the lg breakpoint (1024px) up
const uprightQuery = '(max-width: 1023px)'
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(uprightQuery)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const useUpright = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(uprightQuery).matches)

export function BassGuitar() {
  const upright = useUpright()
  const drawing = useRef<SVGGElement>(null)
  const paths = useRef<(SVGPathElement | null)[]>([])
  const fingers = useRef<(SVGCircleElement | null)[]>([])
  const vibrations = useRef<(Vibration | null)[]>(strings.map(() => null))
  const frame = useRef(0)
  const lastPoint = useRef<{ x: number; y: number } | null>(null)
  // A drag that strummed shouldn't also play a note when the button is released
  const strummed = useRef(false)
  const audio = useRef<{ ctx: AudioContext; buffers: Map<string, AudioBuffer> } | null>(null)
  const reduceMotion = useRef(false)

  useEffect(() => {
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return () => {
      cancelAnimationFrame(frame.current)
      audio.current?.ctx.close()
    }
  }, [])

  function draw() {
    const now = performance.now()
    let active = false

    strings.forEach((string, i) => {
      const path = paths.current[i]
      const finger = fingers.current[i]
      const vib = vibrations.current[i]
      if (!path || !finger) return

      const t = vib ? (now - vib.start) / 1000 : 0
      const envelope = vib ? vib.amp * Math.exp(-DECAY * t) : 0
      if (!vib || envelope < 0.15) {
        vibrations.current[i] = null
        path.setAttribute('d', `M${BRIDGE_X} ${string.bridgeY} L${NUT_X} ${string.nutY}`)
        path.dataset.active = 'false'
        finger.setAttribute('opacity', '0')
        return
      }

      active = true
      path.dataset.active = 'true'
      const w = 2 * Math.PI * vib.speed * t
      const [m1, m2, m3] = vib.modes
      let d = `M${BRIDGE_X} ${string.bridgeY}`
      for (let s = 1; s <= SEGMENTS; s++) {
        const u = s / SEGMENTS
        const x = BRIDGE_X + u * (vib.stopX - BRIDGE_X)
        const shape =
          m1 * Math.sin(Math.PI * u) * Math.cos(w) +
          m2 * Math.sin(2 * Math.PI * u) * Math.cos(2 * w) +
          m3 * Math.sin(3 * Math.PI * u) * Math.cos(3 * w)
        d += ` L${x.toFixed(1)} ${(stringY(i, x) + envelope * shape).toFixed(2)}`
      }
      // The part between the fret and the nut is held down, so it stays still
      if (vib.stopX < NUT_X) d += ` L${NUT_X} ${string.nutY}`
      path.setAttribute('d', d)

      if (vib.fingerX !== null) {
        finger.setAttribute('cx', vib.fingerX.toFixed(1))
        finger.setAttribute('cy', stringY(i, vib.fingerX).toFixed(1))
        finger.setAttribute('opacity', Math.min(1, (envelope / vib.amp) * 1.5).toFixed(2))
      }
    })

    frame.current = active ? requestAnimationFrame(draw) : 0
  }

  function pluck(index: number, fret: number, position: number, amp: number) {
    if (reduceMotion.current) return
    const stopX = fretX(fret)
    vibrations.current[index] = {
      amp,
      start: performance.now(),
      stopX,
      // Fingers press just behind the fret, toward the nut
      fingerX: fret ? stopX + (fretX(fret - 1) - stopX) * 0.35 : null,
      modes: modesAt(position),
      speed: strings[index].wobble * 2 ** (fret / 24),
    }
    if (!frame.current) frame.current = requestAnimationFrame(draw)
  }

  function play(index: number, fret: number) {
    // The AudioContext can only start after a click or key press, so it's created here
    if (!audio.current) audio.current = { ctx: new AudioContext(), buffers: new Map() }
    const { ctx, buffers } = audio.current
    if (ctx.state === 'suspended') void ctx.resume()

    const key = `${index}:${fret}`
    if (!buffers.has(key))
      buffers.set(key, pluckBuffer(ctx, strings[index].freq * 2 ** (fret / 12)))
    const source = ctx.createBufferSource()
    source.buffer = buffers.get(key)!
    // Round off the top end so it sounds like a bass, not a harpsichord
    const tone = ctx.createBiquadFilter()
    tone.type = 'lowpass'
    tone.frequency.value = 1600
    const gain = ctx.createGain()
    gain.gain.value = 0.5
    source.connect(tone).connect(gain).connect(ctx.destination)
    source.start()
  }

  /** Pointer position in the photo's own pixels, whichever way it's rotated. */
  function toDrawing(event: { clientX: number; clientY: number }) {
    const matrix = drawing.current?.getScreenCTM()
    if (!matrix) return null
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
    return { x: point.x, y: point.y }
  }

  /** The string nearest to a point on the neck or body, or null if it's off the strings. */
  function stringAt(x: number, y: number) {
    if (x < BRIDGE_X - 10 || x > NUT_X + 10) return null
    if (y < stringY(0, x) - 16 || y > stringY(strings.length - 1, x) + 16) return null
    let nearest = 0
    strings.forEach((_, i) => {
      if (Math.abs(y - stringY(i, x)) < Math.abs(y - stringY(nearest, x))) nearest = i
    })
    return nearest
  }

  function handleClick(event: { clientX: number; clientY: number }) {
    if (strummed.current) {
      strummed.current = false
      return
    }
    const point = toDrawing(event)
    if (!point) return
    const index = stringAt(point.x, point.y)
    if (index === null) return
    const fret = fretAt(point.x)
    // Open strings are plucked where you clicked; fretted notes near the pickups
    const position = fret ? 0.2 : (point.x - BRIDGE_X) / (NUT_X - BRIDGE_X)
    pluck(index, fret, Math.min(Math.max(position, 0.05), 0.95), 10)
    play(index, fret)
  }

  // Strum: every string the pointer crossed since the last move. Silent when just hovering;
  // with the button (or a finger) down it plays the open strings.
  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    const point = toDrawing(event)
    const last = lastPoint.current
    lastPoint.current = point
    if (!point || !last || point.x < BRIDGE_X || point.x > NUT_X) return
    const pressed = (event.buttons & 1) === 1

    strings.forEach((_, i) => {
      if ((last.y - stringY(i, last.x)) * (point.y - stringY(i, point.x)) >= 0) return
      const position = Math.min(Math.max((point.x - BRIDGE_X) / (NUT_X - BRIDGE_X), 0.05), 0.95)
      pluck(i, 0, position, Math.min(3 + Math.abs(point.y - last.y) * 0.4, 12))
      if (pressed) {
        play(i, 0)
        strummed.current = true
      }
    })
  }

  return (
    <figure className="flex flex-col items-center">
      <svg
        viewBox={
          upright ? `${CROP_TOP} 0 ${CROP_HEIGHT} ${W}` : `0 ${CROP_TOP} ${W} ${CROP_HEIGHT}`
        }
        role="img"
        aria-label="Blue Jazz Bass. Click a spot on the neck to play that fret, or drag across the strings to strum."
        onClick={handleClick}
        onPointerDown={() => (strummed.current = false)}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => (lastPoint.current = null)}
        className={
          upright
            ? 'block w-full max-w-[21rem] cursor-pointer touch-pan-y select-none'
            : 'block w-full max-w-[100rem] cursor-pointer touch-manipulation select-none'
        }
      >
        <g ref={drawing} transform={upright ? `matrix(0 -1 1 0 0 ${W})` : undefined}>
          <image href={IMAGE} width={W} height={H} />

          {/* Strings: the still part from the nut to each tuner post, then the part that vibrates */}
          {strings.map((string) => (
            <line
              key={string.note}
              x1={NUT_X}
              y1={string.nutY}
              x2={string.post[0]}
              y2={string.post[1]}
              stroke="#cdd2d8"
              strokeWidth={string.width * 0.9}
              strokeLinecap="round"
            />
          ))}
          {strings.map((string, i) => (
            <path
              key={string.note}
              ref={(el) => {
                paths.current[i] = el
              }}
              d={`M${BRIDGE_X} ${string.bridgeY} L${NUT_X} ${string.nutY}`}
              fill="none"
              strokeWidth={string.width}
              strokeLinecap="round"
              className="stroke-[#cdd2d8] transition-[stroke] duration-500 data-[active=true]:stroke-white data-[active=true]:duration-75"
            />
          ))}
          {strings.map((string, i) => (
            <circle
              key={string.note}
              ref={(el) => {
                fingers.current[i] = el
              }}
              r="9"
              opacity="0"
              fill="#f2eadf"
              stroke="#0e1a2e"
              strokeOpacity="0.45"
              strokeWidth="2"
            />
          ))}
        </g>
      </svg>

      <figcaption className="mt-6 flex flex-col items-center gap-3 px-4 text-center">
        <span className="text-sm text-muted">
          {upright
            ? 'Tap the neck to play a note, or swipe across the strings to strum.'
            : 'Click anywhere on the neck to play that fret, or drag across the strings to strum.'}
        </span>
        <span role="group" aria-label="Open strings" className="flex gap-2">
          {strings.map((string, i) => (
            <button
              key={string.note}
              type="button"
              onClick={() => {
                pluck(i, 0, 0.25, 10)
                play(i, 0)
              }}
              aria-label={`Play the open ${string.note} string`}
              className="grid size-11 touch-manipulation place-items-center rounded-full border border-line font-display text-lg font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              {string.note}
            </button>
          ))}
        </span>
      </figcaption>
    </figure>
  )
}
