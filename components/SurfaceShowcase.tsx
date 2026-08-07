'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const STEP_DURATION = 6000

// ─── 01 · WhatsApp Bot screen — a live natural-conversation booking exchange ─
type ChatMsg = { id: number; dir: 'in' | 'out'; text: string }
type ChatEvent =
  | { at: number; kind: 'msg'; dir: 'in' | 'out'; text: string }
  | { at: number; kind: 'typing-on' }
  | { at: number; kind: 'typing-off' }

const BOOKING_TIMELINE: ChatEvent[] = [
  { at: 400,  kind: 'msg', dir: 'in', text: 'Hey, is Saturday afternoon free for a haircut?' },
  { at: 1000, kind: 'typing-on' },
  { at: 2000, kind: 'typing-off' },
  { at: 2000, kind: 'msg', dir: 'out', text: 'I have 2:00 PM or 4:00 PM open Saturday. Which works?' },
  { at: 2800, kind: 'msg', dir: 'in', text: '2pm please 🙌' },
  { at: 3400, kind: 'typing-on' },
  { at: 4200, kind: 'typing-off' },
  { at: 4200, kind: 'msg', dir: 'out', text: 'Booked! Saturday at 2:00 PM. See you then 💇' },
]

function WhatsAppScreen() {
  const [msgs, setMsgs] = useState<ChatMsg[]>([])
  const [typing, setTyping] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const msgId = useRef(0)

  useEffect(() => {
    const t0 = setTimeout(() => {
      BOOKING_TIMELINE.forEach((ev) => {
        const t = setTimeout(() => {
          if (ev.kind === 'typing-on') setTyping(true)
          if (ev.kind === 'typing-off') setTyping(false)
          if (ev.kind === 'msg') setMsgs((p) => [...p, { id: ++msgId.current, dir: ev.dir, text: ev.text }])
        }, ev.at)
        timers.current.push(t)
      })
    }, 0)
    timers.current.push(t0)
    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [])

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2.5 bg-[#075E54] px-3.5 py-2.5">
        <div className="w-7 h-7 rounded-full bg-coral flex items-center justify-center text-white text-xs font-medium flex-shrink-0">G</div>
        <div className="min-w-0">
          <p className="text-white text-[12px] font-medium leading-tight">Glam Salon</p>
          <p className="text-[#9DE8D8] text-[9px] flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#9DE8D8] inline-block" style={{ animation: 'pulse-soft 2s ease-in-out infinite' }} />
            Nira AI · online
          </p>
        </div>
      </div>
      <div className="flex-1 bg-[#ECE5DD] px-2.5 pt-2.5 pb-3 flex flex-col gap-2 no-scrollbar overflow-hidden">
        {msgs.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.dir === 'out' ? 'justify-end' : 'justify-start'}`}
            style={{ animation: 'slideInMsg 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
          >
            <div className={`rounded-2xl px-2.5 py-2 shadow-sm max-w-[85%] ${m.dir === 'out' ? 'bg-[#DCF8C6] rounded-tr-sm' : 'bg-white rounded-tl-sm'}`}>
              <p className="text-[10.5px] text-[#1E293B] leading-[1.5]">{m.text}</p>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start" style={{ animation: 'slideInMsg 0.3s ease-out forwards' }}>
            <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2.5 shadow-sm">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-slate-400"
                    style={{ animation: 'typing-dot 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── 02 · Mobile App screen — switches between real tabs in one phone ──────
function BookingsPanel() {
  return (
    <div className="px-3 pt-3 space-y-2">
      <p className="text-[8px] text-slate-400 uppercase tracking-wide mb-1">Today · 2 bookings</p>
      {[{ n: 'Amina K.', t: '10:00 AM', s: 'Classic Facial' }, { n: 'Rehema M.', t: '11:30 AM', s: 'Manicure' }].map((b, i) => (
        <div key={i} className="bg-white rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
          <div className="w-6 h-6 rounded-full bg-lavender-light flex items-center justify-center text-[9px] font-medium text-lavender-dark flex-shrink-0">{b.n[0]}</div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-[#1E293B] truncate">{b.n}</p>
            <p className="text-[9px] text-slate-400 truncate">{b.s}</p>
          </div>
          <span className="text-[9px] font-medium text-coral flex-shrink-0">{b.t}</span>
        </div>
      ))}
    </div>
  )
}

function ProductsPanel() {
  const items = [
    { name: 'Niacinamide Serum', price: 'TZS 42,000', color: '#FFE8E8' },
    { name: 'Vitamin C Cream', price: 'TZS 38,000', color: '#F0ECFB' },
    { name: 'Clay Mask', price: 'TZS 25,000', color: '#E4F7F3' },
    { name: 'Rose Toner', price: 'TZS 19,000', color: '#FFF7E0' },
  ]
  return (
    <div className="px-3 pt-3 grid grid-cols-2 gap-2">
      {items.map((p, i) => (
        <div key={i} className="bg-white rounded-xl p-2 shadow-sm">
          <div className="w-full h-9 rounded-lg mb-1.5" style={{ background: p.color }} />
          <p className="text-[9px] font-medium text-[#1E293B] leading-tight truncate">{p.name}</p>
          <p className="text-[9px] text-coral font-medium">{p.price}</p>
        </div>
      ))}
    </div>
  )
}

function RevenuePanel() {
  const bars = [40, 65, 50, 80, 60, 95]
  return (
    <div className="px-3 pt-3">
      <p className="text-[8px] text-slate-400 uppercase tracking-wide mb-0.5">This week</p>
      <p className="font-serif text-[17px] text-[#1E293B] mb-2">TZS 1,240,000</p>
      <div className="flex items-end gap-1.5 h-12">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-t-md bg-mint" style={{ height: `${h}%`, opacity: i === bars.length - 1 ? 1 : 0.5 }} />
        ))}
      </div>
    </div>
  )
}

function CalendarTabIcon({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}
function ProductsTabIcon({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7L12 3 4 7m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )
}
function RevenueTabIcon({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 15l4-4 3 3 5-6" />
    </svg>
  )
}

const APP_TABS = [
  { key: 'bookings', label: 'Bookings', icon: CalendarTabIcon, Panel: BookingsPanel },
  { key: 'products', label: 'Products', icon: ProductsTabIcon, Panel: ProductsPanel },
  { key: 'revenue', label: 'Revenue', icon: RevenueTabIcon, Panel: RevenuePanel },
]

function MobileAppScreen() {
  const [tab, setTab] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setTab((t) => (t + 1) % APP_TABS.length), 1900)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white px-4 py-2.5 flex items-center justify-between border-b border-slate-100">
        <div>
          <p className="text-[8px] text-slate-400">Good morning</p>
          <p className="text-[11px] font-medium text-[#1E293B]">Glam Beauty Salon</p>
        </div>
        <div className="w-6 h-6 rounded-full bg-lavender-light flex items-center justify-center text-[9px] font-medium text-lavender-dark">G</div>
      </div>

      <div className="flex-1 bg-[#F8F7FF] relative overflow-hidden">
        {APP_TABS.map(({ key, Panel }, i) => (
          <div
            key={key}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: tab === i ? 1 : 0, pointerEvents: tab === i ? 'auto' : 'none' }}
          >
            <Panel />
          </div>
        ))}
      </div>

      <div className="bg-white border-t border-slate-100 px-2 py-1.5">
        <div className="grid grid-cols-3 relative">
          <motion.div
            className="absolute top-0 bottom-0 rounded-xl bg-lavender-light"
            style={{ width: '33.333%' }}
            animate={{ left: `${tab * 33.333}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          />
          {APP_TABS.map(({ key, label, icon: Icon }, i) => (
            <div key={key} className="relative z-10 flex flex-col items-center py-1.5 gap-0.5">
              <Icon className="w-3.5 h-3.5" style={{ color: tab === i ? 'var(--lavender-dark)' : '#CBD5E1' }} />
              <span className="text-[7px] font-medium" style={{ color: tab === i ? 'var(--lavender-dark)' : '#CBD5E1' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── 03 · Marketplace screen — a customer finding you, live ────────────────
function useDecimalCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf: number
    let start: number | null = null
    const step = (ts: number) => {
      if (start === null) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * target * 10) / 10)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    const kickoff = setTimeout(() => { raf = requestAnimationFrame(step) }, 1300)
    return () => { clearTimeout(kickoff); cancelAnimationFrame(raf) }
  }, [target, duration])
  return val
}

function MarketplaceScreen() {
  const [phase, setPhase] = useState(0)
  const rating = useDecimalCountUp(4.9)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1300)
    const t2 = setTimeout(() => setPhase(2), 2500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="relative h-full overflow-hidden" style={{ background: 'linear-gradient(180deg, #EAF6F2 0%, #F8F7FF 100%)' }}>
      <div
        className="absolute inset-0 opacity-40"
        style={{ backgroundImage: 'radial-gradient(circle, #B8A9E0 1px, transparent 1px)', backgroundSize: '18px 18px' }}
      />

      {/* radar ping */}
      <div className="absolute left-1/2 top-12 -translate-x-1/2 flex flex-col items-center">
        <div className="relative w-4 h-4">
          <span className="absolute inset-0 rounded-full" style={{ background: 'var(--gold)' }} />
          {phase === 0 && (
            <>
              <span className="absolute rounded-full" style={{ inset: -10, border: '1px solid var(--gold)', animation: 'radar-ping 1.8s ease-out infinite' }} />
              <span className="absolute rounded-full" style={{ inset: -10, border: '1px solid var(--gold)', animation: 'radar-ping 1.8s ease-out 0.6s infinite' }} />
            </>
          )}
        </div>
        <p className="mt-2.5 text-[9px] font-medium text-[#1E293B] whitespace-nowrap">Customer nearby</p>
      </div>

      {/* business profile card, slides up from the bottom */}
      <div
        className="absolute left-3 right-3 bottom-3 bg-white rounded-2xl shadow-xl p-3"
        style={{
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(140%)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'transform 700ms cubic-bezier(0.34,1.56,0.64,1), opacity 500ms ease-out',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-coral-light flex items-center justify-center text-coral text-xs font-medium flex-shrink-0">G</div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-[#1E293B] truncate">Glam Beauty Salon</p>
            <div className="flex items-center gap-1">
              <svg className="w-2.5 h-2.5" fill="var(--gold)" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-[9px] font-medium text-[#1E293B]">{rating.toFixed(1)}</span>
              <span className="text-[9px] text-slate-400">· 0.4km away</span>
            </div>
          </div>
        </div>
        <div
          className="bg-[#F8F7FF] rounded-lg px-2.5 py-2"
          style={{ opacity: phase >= 2 ? 1 : 0, transition: 'opacity 500ms ease-out' }}
        >
          <p className="text-[9px] text-[#1E293B] leading-snug">&ldquo;Booked in seconds, super friendly bot!&rdquo;</p>
          <p className="text-[8px] text-slate-400 mt-1">Neema, new customer</p>
        </div>
      </div>
    </div>
  )
}

// ─── Data + shared phone shell ──────────────────────────────────────────────
const ITEMS = [
  {
    label: 'WhatsApp Bot',
    title: 'A Real Conversation, Not a Menu',
    desc: 'Customers talk to Nira the way they would talk to your best staff member. No numbered options, no dead ends, just an answer.',
    accent: '#FF6B6B',
    Screen: WhatsAppScreen,
  },
  {
    label: 'Mobile App',
    title: 'Your Whole Business, One Phone',
    desc: 'Bookings, orders, customers, and revenue, all in an app built for the pace of a real salon floor.',
    accent: '#B8A9E0',
    Screen: MobileAppScreen,
  },
  {
    label: 'Marketplace',
    title: 'Found By Customers You Have Never Met',
    desc: 'New customers nearby discover your business, see your reviews, and reach out before you have said a word.',
    accent: '#F5C842',
    Screen: MarketplaceScreen,
  },
]

function PhoneShowcase({ active, accent }: { active: number; accent: string }) {
  const ActiveScreen = ITEMS[active].Screen
  return (
    <div className="relative mx-auto w-[250px] animate-float">
      <motion.div
        className="absolute inset-0 -translate-y-4 translate-x-4 rounded-[44px] blur-3xl pointer-events-none"
        animate={{ backgroundColor: accent }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        style={{ opacity: 0.24 }}
      />
      <div className="relative rounded-[36px] border-[5px] border-[#2D3F57] bg-[#1E293B] shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center px-5 pt-3 pb-1">
          <span className="text-white/70 text-[9px] font-medium">9:41</span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          </div>
        </div>
        <div className="relative" style={{ height: 328 }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="absolute inset-0"
            >
              <ActiveScreen />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ─── Main showcase — one block, story-style stepper drives the phone ───────
export default function SurfaceShowcase() {
  const [active, setActive] = useState(0)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { amount: 0.3 })

  useEffect(() => {
    if (!isInView) return
    const iv = setInterval(() => setActive((a) => (a + 1) % ITEMS.length), STEP_DURATION)
    return () => clearInterval(iv)
  }, [isInView, active])

  return (
    <div ref={containerRef} className="relative max-w-5xl mx-auto px-6">
      {/* ambient glow behind the whole block, tints toward the active surface */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] pointer-events-none"
        style={{ width: 480, height: 480, opacity: 0.1 }}
        animate={{ backgroundColor: ITEMS[active].accent }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_auto] gap-14 items-center">
        {/* Step list */}
        <div className="order-2 lg:order-1 space-y-1">
          {ITEMS.map((item, i) => {
            const isActive = i === active
            return (
              <button
                key={item.label}
                onClick={() => setActive(i)}
                className="w-full text-left rounded-2xl px-5 py-4 transition-colors duration-300"
                style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent' }}
              >
                <span
                  className="text-xs font-medium uppercase tracking-widest transition-colors duration-300"
                  style={{ color: isActive ? item.accent : '#64748B' }}
                >
                  {String(i + 1).padStart(2, '0')} · {item.label}
                </span>
                <h3
                  className="font-serif text-xl lg:text-2xl mt-2 leading-snug transition-colors duration-300"
                  style={{ color: isActive ? 'white' : '#94A3B8' }}
                >
                  {item.title}
                </h3>
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="overflow-hidden"
                    >
                      <p className="text-slate-400 leading-relaxed mt-3 pr-2 lg:pr-10">{item.desc}</p>
                      <div className="h-[3px] rounded-full bg-white/10 mt-4 w-28 overflow-hidden">
                        <motion.div
                          key={active}
                          className="h-full rounded-full"
                          style={{ background: item.accent, transformOrigin: 'left' }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: STEP_DURATION / 1000, ease: 'linear' }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
        </div>

        {/* Phone showcase */}
        <div className="order-1 lg:order-2 flex justify-center py-6">
          <PhoneShowcase active={active} accent={ITEMS[active].accent} />
        </div>
      </div>
    </div>
  )
}
