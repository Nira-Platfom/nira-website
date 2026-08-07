'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

type Step = {
  step: string
  title: string
  desc: string
  icon: React.ReactNode
}

function StepCard({ item, index }: { item: Step; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="card-hover bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 hover:border-white/20 h-full"
    >
      <motion.div
        initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
        animate={isInView ? { scale: 1, opacity: 1, rotate: 0 } : {}}
        transition={{ duration: 0.45, delay: index * 0.15 + 0.15, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-12 h-12 rounded-xl bg-coral/10 border border-coral/20 flex items-center justify-center text-coral mb-5"
      >
        {item.icon}
      </motion.div>
      <p className="step-num font-serif text-3xl mb-2">{item.step}</p>
      <h3 className="font-serif text-xl text-white mb-3">{item.title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
    </motion.div>
  )
}

// A connecting rail above the three step cards, its segments fill left to
// right as the section scrolls into view, one step visibly leading to the
// next instead of three disconnected cards.
export default function HowItWorksFlow({ steps }: { steps: Step[] }) {
  const railRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start 75%', 'end 55%'] })
  const segment0 = useTransform(scrollYProgress, [0.05, 0.5], [0, 1])
  const segment1 = useTransform(scrollYProgress, [0.5, 0.95], [0, 1])

  return (
    <div ref={railRef} className="relative">
      {/* Connecting rail, desktop only */}
      <div className="hidden md:flex items-center mb-8 px-[calc(16.6%-10px)]">
        <div className="w-2.5 h-2.5 rounded-full bg-coral flex-shrink-0" />
        <div className="flex-1 h-px mx-2 relative overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-coral to-lavender"
            style={{ scaleX: segment0, transformOrigin: 'left', width: '100%' }}
          />
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-lavender flex-shrink-0" />
        <div className="flex-1 h-px mx-2 relative overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-lavender to-mint"
            style={{ scaleX: segment1, transformOrigin: 'left', width: '100%' }}
          />
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-mint flex-shrink-0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item, i) => (
          <StepCard key={item.step} item={item} index={i} />
        ))}
      </div>
    </div>
  )
}
