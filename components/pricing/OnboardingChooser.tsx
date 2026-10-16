'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { ONBOARDING_OPTIONS } from '@/lib/pricing'

/** Self-service vs assisted onboarding, as a segmented switch. */
export default function OnboardingChooser() {
  const [active, setActive] = useState(ONBOARDING_OPTIONS[0].id)
  const option = ONBOARDING_OPTIONS.find((o) => o.id === active) ?? ONBOARDING_OPTIONS[0]

  return (
    <div>
      <div
        role="tablist"
        aria-label="Onboarding options"
        className="relative grid grid-cols-2 rounded-2xl border p-1"
        style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border)' }}
      >
        {ONBOARDING_OPTIONS.map((o) => (
          <button
            key={o.id}
            role="tab"
            aria-selected={o.id === active}
            onClick={() => setActive(o.id)}
            className="relative z-10 h-11 rounded-xl text-[14px] font-medium transition-colors"
            style={{ color: o.id === active ? '#FFFFFF' : 'var(--text-secondary)' }}
          >
            {o.id === active && (
              <motion.span
                layoutId="onboarding-pill"
                className="absolute inset-0 -z-10 rounded-xl bg-coral shadow-btn-coral"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            {o.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={option.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mt-5"
        >
          <p className="font-serif text-[22px] leading-tight" style={{ color: 'var(--text-primary)' }}>
            {option.amount ?? option.label}
          </p>
          <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{option.description}</p>
          <ul className="mt-4 space-y-2">
            {option.points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint-light text-mint-deep">
                  <Check size={12} strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
