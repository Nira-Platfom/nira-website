'use client'

import { useEffect, useRef, useState } from 'react'
import { CalendarCheck, Sparkles, Star } from 'lucide-react'

// One scene per photo: what the customer asked and what Nira did about it.
const SCENES = [
  {
    src: '/grace.jpg', position: 'center top', place: 'Grace Beauty Salon · Masaki', rating: '4.9',
    ask: 'Facial tomorrow in Masaki?', answer: 'Classic Facial · TZS 45,000 — 10:00 is free. Book it?',
    booked: 'Classic Facial', when: 'Tomorrow, 10:00',
  },
  {
    src: '/amina-makeup.jpg', position: 'center top', place: 'Amina Beauty Studio · Sinza', rating: '4.8',
    ask: 'Bridal makeup on Saturday', answer: 'Bridal Glam · TZS 120,000 — Sat 08:00 open. Book it?',
    booked: 'Bridal Glam', when: 'Saturday, 08:00',
  },
  {
    src: '/nail.jpg', position: 'center center', place: 'Naomi Nail Lounge · Mikocheni', rating: '4.7',
    ask: 'Gel nails after 5pm today', answer: 'Gel Manicure · TZS 35,000 — 17:00 free. Book it?',
    booked: 'Gel Manicure', when: 'Today, 17:00',
  },
  {
    src: '/fatuma-hair.jpg', position: 'center top', place: 'Fatuma Hair Salon · Kariakoo', rating: '4.9',
    ask: 'Nataka kusuka rasta Jumamosi', answer: 'Rasta · TZS 60,000 — Jumamosi 09:00 iko wazi. Nikuwekee?',
    booked: 'Rasta (Braids)', when: 'Jumamosi, 09:00',
  },
]

const ROTATE_MS = 5500

export default function HeroVisual() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const frame = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setI((n) => (n + 1) % SCENES.length), ROTATE_MS)
    return () => clearInterval(t)
  }, [paused])

  useEffect(() => {
    // Warm the next photo so the crossfade never flashes.
    const img = new window.Image()
    img.src = SCENES[(i + 1) % SCENES.length].src
  }, [i])

  const onMove = (e: React.MouseEvent) => {
    const r = frame.current?.getBoundingClientRect()
    if (!r) return
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setTilt({ x: py * -5, y: px * 6 })
  }

  const s = SCENES[i]

  return (
    <div
      ref={frame}
      className="relative mx-auto w-full max-w-[520px] px-3 pb-10 pt-6 sm:px-6"
      style={{ perspective: 1200 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); setTilt({ x: 0, y: 0 }) }}
      onMouseMove={onMove}
    >
      {/* soft brand glow */}
      <div
        className="pointer-events-none absolute inset-6 rounded-[40px] blur-3xl"
        style={{ background: 'radial-gradient(60% 60% at 60% 40%, rgba(255,107,107,0.28), rgba(184,169,224,0.18) 60%, transparent 80%)' }}
        aria-hidden="true"
      />

      <div
        className="relative transition-transform duration-300 ease-out"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transformStyle: 'preserve-3d' }}
      >
        {/* Photo */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] shadow-[0_30px_60px_-20px_rgba(15,23,42,0.45)]">
          {SCENES.map((scene, n) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={scene.src}
              src={scene.src}
              alt=""
              loading={n === 0 ? 'eager' : 'lazy'}
              className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1200ms] ease-out"
              style={{
                objectPosition: scene.position,
                opacity: n === i ? 1 : 0,
                transform: n === i ? 'scale(1.06)' : 'scale(1)',
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/5 to-transparent" aria-hidden="true" />

          {/* place + rating */}
          <div key={`place-${i}`} className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-md"
            style={{ animation: 'content-fade-up 500ms ease-out both' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-coral" />
            {s.place}
            <span className="flex items-center gap-0.5 text-white/90"><Star size={11} className="fill-amber-300 text-amber-300" />{s.rating}</span>
          </div>

          {/* progress dots */}
          <div className="absolute bottom-4 right-4 flex gap-1.5">
            {SCENES.map((_, n) => (
              <button
                key={n}
                onClick={() => setI(n)}
                aria-label={`Show example ${n + 1}`}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: n === i ? 22 : 6, backgroundColor: n === i ? '#fff' : 'rgba(255,255,255,0.5)' }}
              />
            ))}
          </div>
        </div>

        {/* Mini conversation — bottom-left, overlapping the photo edge */}
        <div
          key={`chat-${i}`}
          className="absolute -bottom-8 left-0 w-[78%] max-w-[300px] space-y-2 rounded-2xl border p-3 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:-left-2"
          style={{ backgroundColor: 'color-mix(in srgb, var(--bg-card) 92%, transparent)', borderColor: 'var(--border)', transform: 'translateZ(40px)' }}
        >
          <div className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-md bg-coral px-3 py-1.5 text-[12.5px] text-white"
            style={{ animation: 'slideInMsg 450ms ease-out both' }}>
            {s.ask}
          </div>
          <div className="flex items-start gap-2" style={{ animation: 'slideInMsg 450ms ease-out 650ms both' }}>
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral text-white">
              <Sparkles size={12} />
            </span>
            <p className="text-[12.5px] leading-snug" style={{ color: 'var(--text-primary)' }}>{s.answer}</p>
          </div>
        </div>

        {/* Booking confirmed — top-right */}
        <div
          key={`booked-${i}`}
          className="absolute -right-1 top-10 w-[180px] rounded-2xl border p-3 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.35)] sm:-right-4"
          style={{
            backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', transform: 'translateZ(60px)',
            animation: 'slideInMsg 500ms ease-out 1500ms both',
          }}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-mint-light px-2 py-0.5 text-[11px] font-medium text-mint-deep">
            <CalendarCheck size={12} /> Booked with Nira
          </div>
          <p className="mt-1 text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{s.booked}</p>
          <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{s.when}</p>
        </div>
      </div>
    </div>
  )
}
