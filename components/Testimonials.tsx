'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CalendarCheck, Quote, ShoppingBag, Star } from 'lucide-react'

/**
 * Homepage testimonials.
 *
 * `scene` is a beauty photo shown beside the quote to set the mood — it is NOT
 * a picture of the person quoted. When a real customer gives permission, put
 * their portrait in `photo` and it replaces the initials avatar.
 */
const TESTIMONIALS: {
  quote: string
  name: string
  business: string
  kind: string
  scene: string
  position: string
  photo?: string
  highlight: { icon: 'booking' | 'order'; label: string; detail: string }
}[] = [
  {
    quote: 'Nira imebadilisha biashara yangu kabisa. Sasa wateja wanaweza kupanga miadi usiku wa manane na bot inawajibu papo hapo!',
    name: 'Grace Mwangi',
    business: 'Glam Beauty Salon · Dar es Salaam',
    kind: 'Hair & beauty salon',
    scene: '/fatuma-hair.jpg',
    position: 'center 20%',
    highlight: { icon: 'booking', label: 'Booked at 23:40', detail: 'Box braids · Saturday 09:00' },
  },
  {
    quote: 'I used to spend 3 hours a day just answering WhatsApp messages. Now Nira handles everything and I focus on my clients. Best decision I made.',
    name: 'Amina Hassan',
    business: 'Pure Glow Spa · Nairobi',
    kind: 'Spa & makeup studio',
    scene: '/amina-makeup.jpg',
    position: 'center 25%',
    highlight: { icon: 'booking', label: 'Answered instantly', detail: 'Bridal glam · Sat 08:00' },
  },
  {
    quote: 'My cosmetics shop doubled orders in 2 months. Customers love how easy it is to order through WhatsApp. Nira is simply the best.',
    name: 'Zainab Ali',
    business: 'Zainab Beauty · Mombasa',
    kind: 'Cosmetics shop',
    scene: '/nail.jpg',
    position: 'center center',
    highlight: { icon: 'order', label: 'New order via Nira', detail: '2 × Shea body butter' },
  },
]

const ROTATE_MS = 7000

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

export default function Testimonials() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const t = TESTIMONIALS[i]
  const go = (n: number) => setI((n + TESTIMONIALS.length) % TESTIMONIALS.length)

  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => go(i + 1), ROTATE_MS)
    return () => clearTimeout(id)
  }, [i, paused])

  return (
    <section className="relative overflow-hidden py-20 md:py-24" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-coral/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-lavender/15 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <span className="text-xs font-medium uppercase tracking-widest text-coral">Testimonials</span>
            <h2 className="mt-3 font-serif text-[34px] leading-tight md:text-[42px]" style={{ color: 'var(--text-primary)' }}>
              Loved by beauty businesses
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Salons, spas and cosmetic shops use Nira to answer every customer and fill their calendars.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(i - 1)}
              aria-label="Previous testimonial"
              className="flex h-12 w-12 items-center justify-center rounded-full border transition-all hover:-translate-x-0.5 hover:border-coral hover:text-coral"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(i + 1)}
              aria-label="Next testimonial"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-coral text-white shadow-btn-coral transition-transform hover:translate-x-0.5"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div
          className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Photo panel */}
          <div className="relative h-[300px] overflow-hidden rounded-3xl sm:h-[380px] lg:h-auto lg:min-h-[440px]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={t.scene}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image src={t.scene} alt="" fill sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" style={{ objectPosition: t.position }} />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[12px] font-medium text-slate-800 backdrop-blur">
              {t.kind}
            </span>

            {/* Floating "what Nira did" card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/15 p-3.5 text-white backdrop-blur-md sm:right-auto sm:min-w-[260px]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral">
                  {t.highlight.icon === 'booking' ? <CalendarCheck size={18} /> : <ShoppingBag size={18} />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium">{t.highlight.label}</span>
                  <span className="block truncate text-[12px] text-white/75">{t.highlight.detail}</span>
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quote card */}
          <div
            className="relative flex flex-col overflow-hidden rounded-3xl border p-7 sm:p-9"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-md)' }}
          >
            <Quote size={56} className="absolute right-6 top-6 text-coral opacity-[0.12]" aria-hidden="true" />

            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} size={16} className="fill-coral text-coral" />
              ))}
            </div>

            <div className="relative mt-6 min-h-[168px] flex-1 sm:min-h-[150px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={t.name}
                  initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="font-serif text-[22px] leading-[1.45] sm:text-[26px]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  “{t.quote}”
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* Author tabs with progress */}
            <div className="mt-8 grid grid-cols-3 gap-2 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
              {TESTIMONIALS.map((p, k) => {
                const active = k === i
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => go(k)}
                    aria-label={`Show testimonial from ${p.name}`}
                    aria-current={active}
                    className={`group relative flex min-h-[48px] items-center gap-2.5 rounded-xl p-2 text-left transition-colors ${active ? '' : 'opacity-60 hover:opacity-100'}`}
                  >
                    {p.photo ? (
                      <Image src={p.photo} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                    ) : (
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-medium transition-colors ${active ? 'bg-coral text-white' : 'bg-coral-light text-coral-deep'}`}
                      >
                        {initials(p.name)}
                      </span>
                    )}
                    <span className="hidden min-w-0 sm:block">
                      <span className="block truncate text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{p.name}</span>
                      <span className="block truncate text-[11px]" style={{ color: 'var(--text-muted)' }}>{p.business}</span>
                    </span>
                    <span className="absolute inset-x-2 -top-[21px] h-0.5 overflow-hidden rounded-full" aria-hidden="true">
                      {active && (
                        <motion.span
                          key={`${i}-${paused}`}
                          className="block h-full bg-coral"
                          initial={{ width: paused ? '100%' : '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: paused ? 0 : ROTATE_MS / 1000, ease: 'linear' }}
                        />
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
            {/* Name for small screens, where tabs show initials only */}
            <p className="mt-3 text-[13px] sm:hidden" style={{ color: 'var(--text-muted)' }}>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{t.name}</span> · {t.business}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
