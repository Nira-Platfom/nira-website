'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

type ChatMsg = { id: number; dir: 'in' | 'out'; text: string }

type Event =
  | { at: number; kind: 'msg'; dir: 'in' | 'out'; text: string }
  | { at: number; kind: 'typing-on' }
  | { at: number; kind: 'typing-off' }

const TIMELINE: Event[] = [
  { at: 600,  kind: 'msg',        dir: 'in',  text: 'Hi! What\'s good for oily skin? 🤔' },
  { at: 1200, kind: 'typing-on' },
  { at: 2400, kind: 'typing-off' },
  { at: 2400, kind: 'msg',        dir: 'out', text: '✨ I recommend Niacinamide Gel Cream\n• Controls shine & minimizes pores\n• Price: TZS 35,000' },
  { at: 3300, kind: 'msg',        dir: 'out', text: '💧 Apply 2× daily after cleansing\n✅ Suitable: Oily & combination skin' },
  { at: 4400, kind: 'msg',        dir: 'in',  text: 'Can I order it now? 🛒' },
  { at: 5000, kind: 'typing-on' },
  { at: 5900, kind: 'typing-off' },
  { at: 5900, kind: 'msg',        dir: 'out', text: '✅ Order placed!\n📍 Delivery in 2–3 hours\n💰 Total: TZS 35,000 🚀' },
]
const RESTART_DELAY = 10_000

export default function AnimatedChat() {
  const [msgs, setMsgs]     = useState<ChatMsg[]>([])
  const [typing, setTyping] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef    = useRef<HTMLDivElement>(null)
  const timers       = useRef<ReturnType<typeof setTimeout>[]>([])
  const msgId        = useRef(0)

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])

  const scrollBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current)
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    })
  }, [])

  const run = useCallback(() => {
    setMsgs([])
    setTyping(false)
    clear()
    msgId.current = 0

    TIMELINE.forEach((ev) => {
      const t = setTimeout(() => {
        if (ev.kind === 'typing-on')  { setTyping(true);  scrollBottom() }
        if (ev.kind === 'typing-off') { setTyping(false) }
        if (ev.kind === 'msg') {
          const id = ++msgId.current
          setMsgs((p) => [...p, { id, dir: ev.dir, text: ev.text }])
          scrollBottom()
        }
      }, ev.at)
      timers.current.push(t)
    })

    timers.current.push(setTimeout(run, TIMELINE[TIMELINE.length - 1].at + RESTART_DELAY))
  }, [clear, scrollBottom])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { run(); observer.disconnect() }
      },
      { threshold: 0.2 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => { observer.disconnect(); clear() }
  }, [run, clear])

  return (
    <div ref={containerRef} className="relative mx-auto w-[268px] animate-float">
      {/* Glow */}
      <div className="absolute inset-0 -translate-y-6 translate-x-6 rounded-[48px] bg-coral opacity-[0.18] blur-3xl pointer-events-none" />

      {/* Phone frame */}
      <div className="relative rounded-[40px] border-[5px] border-[#2D3F57] bg-[#1E293B] shadow-2xl overflow-hidden">

        {/* Status bar */}
        <div className="flex justify-between items-center px-6 pt-3 pb-1">
          <span className="text-white/80 text-[10px] font-medium">9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="13" height="9" viewBox="0 0 13 9" fill="white" opacity="0.7">
              <rect x="0" y="4" width="2.5" height="5" rx="0.6"/>
              <rect x="3.5" y="2.5" width="2.5" height="6.5" rx="0.6"/>
              <rect x="7" y="1" width="2.5" height="8" rx="0.6"/>
              <rect x="10.5" y="0" width="2.5" height="9" rx="0.6"/>
            </svg>
            <div className="w-[18px] h-[11px] border border-white/60 rounded-[3px] flex items-center px-[2px]">
              <div className="w-[12px] h-[7px] bg-white/70 rounded-[2px]" />
            </div>
          </div>
        </div>

        {/* WhatsApp header */}
        <div className="flex items-center gap-3 bg-[#075E54] px-4 py-2.5">
          <div className="w-9 h-9 rounded-full bg-coral flex items-center justify-center text-white text-sm font-medium flex-shrink-0 shadow-md">
            G
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium leading-tight">Glam Beauty Shop</p>
            <p className="text-[#9DE8D8] text-[10px] flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#9DE8D8] inline-block"
                style={{ animation: 'pulse-soft 2s ease-in-out infinite' }}
              />
              Nira AI · online
            </p>
          </div>
          {/* More dots icon */}
          <svg width="16" height="4" viewBox="0 0 16 4" fill="white" opacity="0.5">
            <circle cx="2" cy="2" r="2"/><circle cx="8" cy="2" r="2"/><circle cx="14" cy="2" r="2"/>
          </svg>
        </div>

        {/* Chat area */}
        <div
          ref={scrollRef}
          className="bg-[#ECE5DD] px-3 pt-3 pb-2 flex flex-col gap-2.5 no-scrollbar"
          style={{ height: 360, overflowY: 'auto' }}
        >
          {msgs.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.dir === 'out' ? 'justify-end' : 'justify-start'}`}
              style={{ animation: 'slideInMsg 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
            >
              <div
                className={`rounded-2xl px-3 py-2.5 shadow-sm max-w-[88%] ${
                  m.dir === 'out'
                    ? 'bg-[#DCF8C6] rounded-tr-sm'
                    : 'bg-white rounded-tl-sm'
                }`}
              >
                <p className="text-[11.5px] text-[#1E293B] whitespace-pre-line leading-[1.55]">
                  {m.text}
                </p>
                <p className="text-[9px] text-slate-400 mt-0.5 text-right">
                  now {m.dir === 'out' && (
                    <span className="text-[#53bdeb]">✓✓</span>
                  )}
                </p>
              </div>
            </div>
          ))}

          {typing && (
            <div
              className="flex justify-start"
              style={{ animation: 'slideInMsg 0.3s ease-out forwards' }}
            >
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-slate-400"
                      style={{
                        animation: `typing-dot 1.2s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Spacer so content doesn't hide behind label */}
          <div className="h-2" />
        </div>

        {/* Nira label pinned at bottom */}
        <div className="bg-[#ECE5DD] px-3 pb-3 text-center">
          <p className="text-[9px] text-slate-400 italic">✨ Powered by Nira AI</p>
        </div>
      </div>
    </div>
  )
}
