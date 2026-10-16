'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { PRICING_FAQ } from '@/lib/pricing'

export default function PricingFaq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="divide-y rounded-3xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}>
      {PRICING_FAQ.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-[16px] font-medium" style={{ color: 'var(--text-primary)' }}>{item.q}</span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? 'rotate-45 border-coral bg-coral text-white' : ''}`}
                style={isOpen ? undefined : { borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                aria-hidden="true"
              >
                <Plus size={16} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
