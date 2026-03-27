'use client'

import { useEffect, useRef, useState } from 'react'

const BARS = [
  { label: 'Mon', pct: 38 },
  { label: 'Tue', pct: 55 },
  { label: 'Wed', pct: 42 },
  { label: 'Thu', pct: 68 },
  { label: 'Fri', pct: 52 },
  { label: 'Sat', pct: 82 },
  { label: 'Sun', pct: 96 },
]

function useCountUp(target: number, duration = 1800, active = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf: number
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.floor(eased * target))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, active])
  return val
}

export default function AnimatedRevenue() {
  const ref    = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setLive(true); observer.disconnect() } },
      { threshold: 0.35 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const revenue   = useCountUp(1_240_000, 1800, live)
  const orders    = useCountUp(47,        1200, live)
  const customers = useCountUp(24,        1400, live)

  return (
    <div ref={ref} className="relative">
      {/* Glow */}
      <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl bg-mint opacity-20 blur-2xl pointer-events-none" />

      <div className="relative bg-white rounded-3xl border border-nira-border p-7 shadow-2xl w-[310px]">

        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">This Month</p>
            <p className="font-serif text-[28px] text-[#1E293B] mt-0.5 leading-none">
              TZS {live ? revenue.toLocaleString() : '0'}
            </p>
          </div>
          <div className="bg-mint-light text-mint-dark text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            +23%
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mb-5">vs TZS 1,008,000 last month</p>

        {/* Bar chart */}
        <div className="flex items-end gap-1.5 h-20 mb-1">
          {BARS.map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div
                className={`w-full rounded-t-md ${i === 6 ? 'bg-coral' : 'bg-coral-light'}`}
                style={{
                  height: `${bar.pct}%`,
                  transformOrigin: 'bottom',
                  transform: live ? 'scaleY(1)' : 'scaleY(0)',
                  transition: `transform 0.9s cubic-bezier(0.34,1.56,0.64,1) ${i * 100}ms`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Day labels */}
        <div className="flex gap-1.5 mb-5">
          {BARS.map((bar, i) => (
            <div key={i} className="flex-1 text-center">
              <span className={`text-[9px] ${i === 6 ? 'text-coral font-medium' : 'text-slate-300'}`}>
                {bar.label}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-nira-border mb-4" />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Orders',      value: orders,    suffix: '' },
            { label: 'Customers',   value: customers, suffix: '' },
            { label: 'Bot uptime',  value: 98,        suffix: '%' },
          ].map(({ label, value, suffix }) => (
            <div key={label} className="text-center">
              <p className="font-serif text-lg text-[#1E293B] leading-none">
                {live ? value : 0}{suffix}
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Live dot */}
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-nira-border">
          <div
            className="w-1.5 h-1.5 rounded-full bg-mint-dark"
            style={{ animation: 'pulse-soft 2s ease-in-out infinite' }}
          />
          <p className="text-[10px] text-mint-dark font-medium">Live dashboard · updated just now</p>
        </div>
      </div>
    </div>
  )
}
