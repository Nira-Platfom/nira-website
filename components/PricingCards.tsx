'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { TiltCard } from './animations'

// Each card flings in from a different direction, like being dealt onto a
// table, converging on its resting position. Triggers once, on first scroll
// into view.
const FLING_FROM = [
  { x: -60, y: 90, rotate: -14, scale: 0.82 },
  { x: 0,   y: 120, rotate: 0,  scale: 0.78 },
  { x: 60,  y: 90, rotate: 14,  scale: 0.82 },
]

function FlingIn({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const from = FLING_FROM[index] ?? FLING_FROM[0]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: from.x, y: from.y, rotate: from.rotate, scale: from.scale }}
      animate={isInView ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 } : {}}
      transition={{ type: 'spring', stiffness: 170, damping: 15, mass: 0.9, delay: index * 0.13 }}
    >
      {children}
    </motion.div>
  )
}

const PLANS = [
  {
    name: 'Free',
    price: 'TZS 0',
    period: '/month',
    desc: 'Perfect for getting started. No credit card needed.',
    features: ['100 messages a month', '1 team member', 'Bookings & orders', 'No AI advice or analytics'],
    cta: 'Get started free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 'TZS 35,000',
    period: '/month',
    desc: 'Everything you need to grow your beauty business.',
    features: ['Unlimited messages', 'Up to 3 team members', 'AI skincare advice', 'Full analytics & broadcasts'],
    cta: 'Get Plan',
    highlight: true,
  },
  {
    name: 'Business',
    price: 'TZS 350,000',
    period: '/year',
    desc: 'TZS 29,167/month, saves TZS 70,000 vs monthly billing.',
    features: ['Unlimited messages', 'Up to 10 team members', 'Everything in Pro', 'Custom bot flows & priority support'],
    cta: 'Get Plan',
    highlight: false,
  },
]

export default function PricingCards() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {PLANS.map((plan, i) => {
        const isDimmed = hovered !== null && hovered !== i
        const isFocused = hovered === i

        return (
          <FlingIn key={plan.name} index={i}>
          <motion.div
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            animate={{
              scale: isFocused ? 1.035 : isDimmed ? 0.97 : 1,
              opacity: isDimmed ? 0.7 : 1,
            }}
            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={{ position: 'relative', zIndex: isFocused ? 10 : 1 }}
          >
            <TiltCard max={5} className="h-full">
              <div
                className={`relative rounded-2xl p-7 h-full transition-shadow duration-300 ${
                  plan.highlight
                    ? 'bg-coral text-white shadow-2xl shadow-coral/30 md:-mt-3 md:mb-3'
                    : 'hover:shadow-xl'
                }`}
                style={!plan.highlight ? {
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                } : undefined}
              >
                {/* Quiet breathing glow behind the recommended plan — draws the eye at rest */}
                {plan.highlight && (
                  <div
                    className="absolute inset-0 -z-10 rounded-2xl pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at 50% 30%, rgba(255,107,107,0.45) 0%, transparent 70%)',
                      filter: 'blur(28px)',
                      animation: 'outer-glow-breathe 4s ease-in-out infinite',
                    }}
                  />
                )}

                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1E293B] text-white text-[11px] font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-sm font-medium mb-1 ${plan.highlight ? 'text-white/70' : ''}`} style={!plan.highlight ? { color: 'var(--text-muted)' } : undefined}>{plan.name}</h3>
                <p className={`font-serif text-3xl mb-1 ${plan.highlight ? 'text-white' : ''}`} style={!plan.highlight ? { color: 'var(--text-primary)' } : undefined}>
                  {plan.price}
                  <span className={`text-sm font-sans ml-1 ${plan.highlight ? 'text-white/60' : ''}`} style={!plan.highlight ? { color: 'var(--text-muted)' } : undefined}>{plan.period}</span>
                </p>
                <p className={`text-sm mb-5 ${plan.highlight ? 'text-white/80' : ''}`} style={!plan.highlight ? { color: 'var(--text-secondary)' } : undefined}>{plan.desc}</p>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${plan.highlight ? 'text-white/90' : ''}`} style={!plan.highlight ? { color: 'var(--text-secondary)' } : undefined}>
                      <svg className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-mint-dark'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pricing"
                  className={`group/cta btn-press relative block text-center py-3 rounded-xl font-medium text-sm overflow-hidden transition-colors ${
                    plan.highlight ? 'bg-white text-coral hover:bg-coral-light' : 'bg-coral text-white hover:bg-coral-dark'
                  }`}
                >
                  {/* Soft expanding ring on hover — rewards the click-intent moment */}
                  <span
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover/cta:opacity-100"
                    style={{
                      width: 10,
                      height: 10,
                      border: `1.5px solid ${plan.highlight ? 'rgba(255,107,107,0.5)' : 'rgba(255,255,255,0.6)'}`,
                    }}
                  >
                    <span
                      className="absolute inset-0 rounded-full opacity-0 group-hover/cta:opacity-100"
                      style={{
                        border: `1.5px solid ${plan.highlight ? 'rgba(255,107,107,0.5)' : 'rgba(255,255,255,0.6)'}`,
                        animation: 'radar-ping 1.1s ease-out infinite',
                      }}
                    />
                  </span>
                  <span className="relative">{plan.cta}</span>
                </Link>
              </div>
            </TiltCard>
          </motion.div>
          </FlingIn>
        )
      })}
    </div>
  )
}
