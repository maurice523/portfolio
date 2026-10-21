import { motion, useInView, type MotionProps, type Variants } from 'motion/react'
import { useRef, type ReactNode } from 'react'

// Adapted from Magic UI's Blur Fade (magicui.design/docs/components/blur-fade, MIT).
// Changes: no AnimatePresence (nothing here unmounts), project code style.

type BlurFadeProps = MotionProps & {
  children: ReactNode
  className?: string
  duration?: number
  /** Seconds to wait before starting, for staggering several BlurFades. */
  delay?: number
  /** How far it travels in px while fading in. */
  offset?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  /** Wait until it scrolls into view instead of animating on mount. */
  inView?: boolean
  blur?: string
}

/** Fades its children in from slightly blurred and offset. */
export function BlurFade({
  children,
  className,
  duration = 0.4,
  delay = 0,
  offset = 6,
  direction = 'down',
  inView = false,
  blur = '6px',
  ...props
}: BlurFadeProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y'
  const variants: Variants = {
    hidden: {
      [axis]: direction === 'right' || direction === 'down' ? -offset : offset,
      opacity: 0,
      filter: `blur(${blur})`,
    },
    visible: { [axis]: 0, opacity: 1, filter: 'blur(0px)' },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={!inView || isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ delay: 0.04 + delay, duration, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
