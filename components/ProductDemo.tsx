'use client'

import { useState } from 'react'

type Tab = 'how' | 'effects' | 'suitable'

const PRODUCTS = [
  {
    id: 'niacinamide',
    emoji: '💧',
    name: 'Niacinamide 10% Serum',
    category: 'Serum',
    price: 'TZS 42,000',
    color: 'bg-lavender-light',
    accent: 'text-lavender-dark',
    border: 'border-lavender',
    tabs: {
      how: {
        title: 'How to Use',
        icon: '📋',
        steps: [
          'Cleanse your face thoroughly',
          'Apply 3–4 drops on fingertips',
          'Gently press into skin — don\'t rub',
          'Follow with moisturizer',
          'Use morning and evening for best results',
        ],
      },
      effects: {
        title: 'What It Does',
        icon: '✨',
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
        icon: '🎯',
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
    emoji: '🍊',
    name: 'Vitamin C Brightening Cream',
    category: 'Moisturizer',
    price: 'TZS 55,000',
    color: 'bg-coral-light',
    accent: 'text-coral-dark',
    border: 'border-coral',
    tabs: {
      how: {
        title: 'How to Use',
        icon: '📋',
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
        icon: '✨',
        points: [
          { positive: true,  text: 'Brightens dull skin & fades dark spots' },
          { positive: true,  text: 'Boosts collagen for firmer skin' },
          { positive: true,  text: 'Antioxidant protection from pollution' },
          { positive: true,  text: 'Visible glow within 4 weeks of use' },
          { positive: false, text: 'Can cause sun sensitivity — always use SPF' },
        ],
      },
      suitable: {
        title: 'Is It For You?',
        icon: '🎯',
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
    emoji: '☀️',
    name: 'SPF 50+ Daily Sunscreen',
    category: 'Sun Protection',
    price: 'TZS 38,000',
    color: 'bg-mint-light',
    accent: 'text-mint-dark',
    border: 'border-mint',
    tabs: {
      how: {
        title: 'How to Use',
        icon: '📋',
        steps: [
          'Apply as the LAST step of your morning routine',
          'Use a generous amount — don\'t skimp',
          'Cover face, neck & ears',
          'Reapply every 2 hours outdoors',
          'Apply 15 minutes before sun exposure',
        ],
      },
      effects: {
        title: 'What It Does',
        icon: '✨',
        points: [
          { positive: true,  text: 'Blocks 98% of UVA & UVB rays' },
          { positive: true,  text: 'Prevents premature aging & dark spots' },
          { positive: true,  text: 'Lightweight — no white cast formula' },
          { positive: true,  text: 'Also moisturizes & primes skin' },
          { positive: false, text: 'Must reapply after sweating or swimming' },
        ],
      },
      suitable: {
        title: 'Is It For You?',
        icon: '🎯',
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
            <span className="text-2xl">{p.emoji}</span>
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
          <span className="text-lg">🤖</span>
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
            <span className="text-4xl">{product.emoji}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-nira-border">
          {([
            { key: 'how' as Tab,      label: 'How to Use',    icon: '📋' },
            { key: 'effects' as Tab,  label: 'Effects',       icon: '✨' },
            { key: 'suitable' as Tab, label: 'Suitable For',  icon: '🎯' },
          ] as const).map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-3 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                tab === key
                  ? `${product.accent} border-b-2 ${product.border}`
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>{icon}</span>
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
                  <span className={`text-base flex-shrink-0 mt-0.5 ${p.positive ? '' : ''}`}>
                    {p.positive ? '✅' : '⚠️'}
                  </span>
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
            💬 Customers receive this info automatically through WhatsApp — powered by Nira AI
          </p>
        </div>
      </div>
    </div>
  )
}
