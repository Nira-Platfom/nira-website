'use client'

import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

// ─── FadeUp ───────────────────────────────────────────────────────────────────
export function FadeUp({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── FadeIn ───────────────────────────────────────────────────────────────────
export function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── SlideLeft ────────────────────────────────────────────────────────────────
export function SlideLeft({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── SlideRight ───────────────────────────────────────────────────────────────
export function SlideRight({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── StaggerContainer ─────────────────────────────────────────────────────────
export function StaggerContainer({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── StaggerItem ──────────────────────────────────────────────────────────────
export function StaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── ScaleIn ──────────────────────────────────────────────────────────────────
export function ScaleIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.34, 1.56, 0.64, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Parallax ─────────────────────────────────────────────────────────────────
export function Parallax({
  children,
  offset = 60,
  className = '',
}: {
  children: React.ReactNode
  offset?: number
  className?: string
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

// ─── CountUp ──────────────────────────────────────────────────────────────────
export function CountUp({
  from = 0,
  to,
  duration = 2,
  suffix = '',
}: {
  from?: number
  to: number
  duration?: number
  suffix?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(from)

  useEffect(() => {
    if (!isInView) return
    let start = from
    const step = (to - from) / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= to) {
        setCount(to)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, from, to, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

// ─── MagneticButton ───────────────────────────────────────────────────────────
export function MagneticButton({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPosition({ x: x * 0.2, y: y * 0.2 })
  }

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 })

  return (
    <motion.div
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  )
}
