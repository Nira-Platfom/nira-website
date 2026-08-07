'use client'

import { useState } from 'react'

type Tab = 'how' | 'effects' | 'suitable'

function DropIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.5c-3.5 5-7 9-7 13a7 7 0 0014 0c0-4-3.5-8-7-13z" />
    </svg>
  )
}
function GlowIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v3M12 20v3M23 12h-3M4 12H1M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12M19.07 19.07l-2.12-2.12M7.05 7.05L4.93 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function ShieldIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z" />
    </svg>
  )
}
function ListIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  )
}
function SparkIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z" />
    </svg>
  )
}
function TargetIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}
function GoodIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
function CautionIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L13.71 3.86a1 1 0 00-1.72 0z" />
    </svg>
  )
}

const PRODUCTS = [
  {
    id: 'niacinamide',
    Icon: DropIcon,
    name: 'Niacinamide 10% Serum',
    category: 'Serum',
    price: 'TZS 42,000',
    color: 'bg-lavender-light',
    accent: 'text-lavender-dark',
    border: 'border-lavender',
    tabs: {
      how: {
        title: 'How to Use',
        steps: [
          'Cleanse your face thoroughly',
          'Apply 3–4 drops on fingertips',
          'Gently press into skin, do not rub',
          'Follow with moisturizer',
          'Use morning and evening for best results',
        ],
      },
      effects: {
        title: 'What It Does',
        points: [
          { positive: true,  text: 'Minimizes the appearance of pores' },
          { positive: true,  text: 'Controls excess sebum production' },
          { positive: true,  text: 'Evens out skin tone & reduces redness' },
          { positive: true,  text: 'Improves skin texture within 2 weeks' },
          { positive: false, text: 'May cause mild tingling on sensitive skin' },
        ],
      },
      suitable: {
        title: 'Is It For You?',
        types: [
          { type: 'Oily skin',       fit: 'perfect',  note: 'Controls shine, best match' },
          { type: 'Combination',     fit: 'perfect',  note: 'Balances oily zones' },
          { type: 'Normal skin',     fit: 'good',     note: 'Great for maintenance' },
          { type: 'Dry skin',        fit: 'ok',       note: 'Use with a rich moisturizer' },
          { type: 'Sensitive skin',  fit: 'caution',  note: 'Patch test first' },
        ],
      },
    },
  },
  {
    id: 'vitamin-c',
    Icon: GlowIcon,
    name: 'Vitamin C Brightening Cream',
    category: 'Moisturizer',
    price: 'TZS 55,000',
    color: 'bg-coral-light',
    accent: 'text-coral-dark',
    border: 'border-coral',
    tabs: {
      how: {
        title: 'How to Use',
        steps: [
          'Apply after toner or serum',
          'Use a pea-sized amount for the face',
          'Massage in circular upward motions',
          'Apply SPF in the morning',
          'Best used at night for repair benefits',
        ],
      },
      effects: {
        title: 'What It Does',
        points: [
          { positive: true,  text: 'Brightens dull skin & fades dark spots' },
          { positive: true,  text: 'Boosts collagen for firmer skin' },
          { positive: true,  text: 'Antioxidant protection from pollution' },
          { positive: true,  text: 'Visible glow within 4 weeks of use' },
          { positive: false, text: 'Can cause sun sensitivity, always use SPF' },
        ],
      },
      suitable: {
        title: 'Is It For You?',
        types: [
          { type: 'Dull / uneven tone', fit: 'perfect',  note: 'Number one pick for you' },
          { type: 'Normal skin',        fit: 'perfect',  note: 'Great daily brightener' },
          { type: 'Dry skin',           fit: 'good',     note: 'Add extra moisturizer' },
          { type: 'Oily skin',          fit: 'ok',       note: 'Use lightweight formula' },
          { type: 'Acne-prone',         fit: 'caution',  note: 'Avoid on active breakouts' },
        ],
      },
    },
  },
  {
    id: 'sunscreen',
    Icon: ShieldIcon,
    name: 'SPF 50+ Daily Sunscreen',
    category: 'Sun Protection',
    price: 'TZS 38,000',
    color: 'bg-mint-light',
    accent: 'text-mint-dark',
    border: 'border-mint',
    tabs: {
      how: {
        title: 'How to Use',
        steps: [
          'Apply as the LAST step of your morning routine',
          'Use a generous amount, do not skimp',
          'Cover face, neck & ears',
          'Reapply every 2 hours outdoors',
          'Apply 15 minutes before sun exposure',
        ],
      },
      effects: {
        title: 'What It Does',
        points: [
          { positive: true,  text: 'Blocks 98% of UVA & UVB rays' },
          { positive: true,  text: 'Prevents premature aging & dark spots' },
          { positive: true,  text: 'Lightweight, no white cast formula' },
          { positive: true,  text: 'Also moisturizes & primes skin' },
          { positive: false, text: 'Must reapply after sweating or swimming' },
        ],
      },
      suitable: {
        title: 'Is It For You?',
        types: [
          { type: 'All skin types',  fit: 'perfect',  note: 'Suitable for everyone' },
          { type: 'Dark skin tones', fit: 'perfect',  note: 'No white cast, invisible' },
          { type: 'Oily skin',       fit: 'good',     note: 'Matte finish variant' },
          { type: 'Sensitive skin',  fit: 'good',     note: 'Mineral formula available' },
          { type: 'Daily wear',      fit: 'perfect',  note: 'Perfect for East Africa climate' },
        ],
      },
    },
  },
]

const fitColors: Record<string, string> = {
  perfect: 'bg-mint-light text-mint-dark',
  good:    'bg-lavender-light text-lavender-dark',
  ok:      'bg-[#FEF9C3] text-[#854D0E]',
  caution: 'bg-coral-light text-coral-dark',
}
const fitLabels: Record<string, string> = {
  perfect: '✓ Perfect match',
  good:    '✓ Good fit',
  ok:      '~ Okay with care',
  caution: '⚠ Use caution',
}

export default function ProductDemo() {
  const [selected, setSelected] = useState(0)
  const [tab, setTab]           = useState<Tab>('how')

  const product = PRODUCTS[selected]
  const tabData = product.tabs[tab]

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">

      {/* ── Product selector ─────────────────────────────── */}
      <div className="flex lg:flex-col gap-3 lg:w-52 shrink-0">
        {PRODUCTS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => { setSelected(i); setTab('how') }}
            className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
              i === selected
                ? `${p.color} ${p.border} shadow-md`
                : 'bg-white border-nira-border hover:border-slate-300'
            }`}
          >
            <p.Icon className={`w-6 h-6 flex-shrink-0 ${i === selected ? p.accent : 'text-slate-400'}`} />
            <div className="min-w-0">
              <p className={`text-sm font-medium leading-snug ${i === selected ? p.accent : 'text-[#1E293B]'} truncate`}>
                {p.name}
              </p>
              <p className={`text-xs mt-0.5 ${i === selected ? p.accent : 'text-slate-400'}`}>
                {p.price}
              </p>
            </div>
          </button>
        ))}

        {/* AI Ask prompt */}
        <div className="hidden lg:flex items-start gap-2 bg-[#1E293B] rounded-2xl p-4 mt-2">
          <SparkIcon className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-white font-medium mb-1">Ask Nira AI</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              &ldquo;Which product suits my dry skin?&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* ── Detail card ──────────────────────────────────── */}
      <div className="flex-1 bg-white rounded-3xl border border-nira-border shadow-xl overflow-hidden">

        {/* Product header */}
        <div className={`${product.color} px-6 py-5`}>
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-xs font-medium uppercase tracking-wider ${product.accent}`}>
                {product.category}
              </span>
              <h3 className="font-serif text-xl text-[#1E293B] mt-1">{product.name}</h3>
              <p className={`text-sm font-medium mt-0.5 ${product.accent}`}>{product.price}</p>
            </div>
            <product.Icon className={`w-9 h-9 ${product.accent}`} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-nira-border">
          {([
            { key: 'how' as Tab,      label: 'How to Use',    Icon: ListIcon },
            { key: 'effects' as Tab,  label: 'Effects',       Icon: SparkIcon },
            { key: 'suitable' as Tab, label: 'Suitable For',  Icon: TargetIcon },
          ] as const).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-3 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                tab === key
                  ? `${product.accent} border-b-2 ${product.border}`
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">

          {tab === 'how' && (
            <ol className="space-y-3">
              {(tabData as typeof PRODUCTS[0]['tabs']['how']).steps?.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={`w-6 h-6 rounded-full ${product.color} ${product.accent} text-[11px] font-medium flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-600 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          )}

          {tab === 'effects' && (
            <ul className="space-y-2.5">
              {(tabData as typeof PRODUCTS[0]['tabs']['effects']).points?.map((p: {positive: boolean; text: string}, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  {p.positive
                    ? <GoodIcon className="w-4 h-4 text-mint-dark flex-shrink-0 mt-0.5" />
                    : <CautionIcon className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
                  }
                  <p className={`text-sm leading-relaxed ${p.positive ? 'text-slate-600' : 'text-slate-500'}`}>
                    {p.text}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {tab === 'suitable' && (
            <ul className="space-y-2">
              {(tabData as typeof PRODUCTS[0]['tabs']['suitable']).types?.map((t: {type: string; fit: string; note: string}, i: number) => (
                <li key={i} className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-600">{t.type}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <p className="text-[10px] text-slate-400 hidden sm:block">{t.note}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${fitColors[t.fit]}`}>
                      {fitLabels[t.fit]}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <p className="text-[11px] text-slate-400 text-center border-t border-nira-border pt-4">
            Customers get this same answer automatically through WhatsApp, powered by Nira AI.
          </p>
        </div>
      </div>
    </div>
  )
}
