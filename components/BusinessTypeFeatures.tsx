'use client'

import { useState } from 'react'

type BizType = 'salon' | 'shop'

// ── Chat data ──────────────────────────────────────────────────────────────────
const SALON_CHAT = [
  { from: 'bot',  text: '👋 Welcome to Glam Salon!\n\n1️⃣ Book appointment 📅\n2️⃣ View services & prices\n3️⃣ Active promotions 🎉' },
  { from: 'user', text: '1' },
  { from: 'bot',  text: '💆 Choose a service:\n\n1. Classic Facial · TZS 45,000\n2. Manicure · TZS 25,000\n3. Hair Braiding · TZS 60,000' },
  { from: 'user', text: '2' },
  { from: 'bot',  text: '📅 What date works for you?\n(e.g. Saturday, Mon Jan 27)' },
  { from: 'user', text: 'Saturday 10am' },
  { from: 'bot',  text: '✅ Booked!\nManicure · Sat, Jan 25 · 10:00 AM\n\nWe\'ll remind you 1hr before 🔔' },
]

const SHOP_CHAT = [
  { from: 'user', text: 'Do you have something for oily skin?' },
  { from: 'bot',  text: '💧 Yes! I recommend:\n\nNiacinamide 10% Serum\n✓ Controls oil\n✓ Minimises pores\n✓ Evens skin tone\nTZS 42,000' },
  { from: 'user', text: 'How do I use it?' },
  { from: 'bot',  text: '📋 How to use:\n1. Cleanse your face\n2. Apply 3–4 drops\n3. Press gently — don\'t rub\n4. Follow with moisturiser\n\nBest morning & evening!' },
  { from: 'user', text: "I'll take 2 bottles" },
  { from: 'bot',  text: '🛒 Order confirmed!\n2× Niacinamide Serum\nTotal: TZS 84,000\n\nDelivery details coming soon 🚚' },
]

// ── Feature data ───────────────────────────────────────────────────────────────
const SALON_FEATURES = [
  {
    icon: '📅',
    title: 'Guided Booking Flow',
    desc: 'Customers book appointments step-by-step through WhatsApp — no calls, no back-and-forth.',
  },
  {
    icon: '💆',
    title: 'Service Menu & Pricing',
    desc: 'All services, durations and prices displayed automatically in every customer conversation.',
  },
  {
    icon: '🔔',
    title: 'Automatic Reminders',
    desc: 'Customers receive a reminder 1 hour before their appointment — zero no-shows.',
  },
  {
    icon: '📊',
    title: 'Daily Schedule View',
    desc: "See today's full booking list on your mobile dashboard the moment you open the app.",
  },
  {
    icon: '🎉',
    title: 'Promotions & Offers',
    desc: 'Broadcast seasonal deals to all your customers with one tap — fills slow days fast.',
  },
  {
    icon: '⭐',
    title: 'Post-Visit Follow-ups',
    desc: 'Automatic follow-up messages after each appointment keep clients loyal and returning.',
  },
]

const SHOP_FEATURES = [
  {
    icon: '🤖',
    title: 'AI Skincare Advisor',
    desc: 'Recommends the right products for each customer\'s skin type — oily, dry, sensitive or combo.',
  },
  {
    icon: '📋',
    title: 'Usage Instructions',
    desc: 'Sends step-by-step how-to guides for every product automatically through WhatsApp.',
  },
  {
    icon: '🛒',
    title: 'WhatsApp Orders',
    desc: 'Customers order products, confirm quantity and share delivery details — all inside the chat.',
  },
  {
    icon: '⚠️',
    title: 'Side Effects & Safety',
    desc: 'Shares cautions, patch-test advice and warnings for each product with every customer.',
  },
  {
    icon: '📦',
    title: 'Live Stock Awareness',
    desc: 'The bot only recommends products that are currently in stock — no broken promises.',
  },
  {
    icon: '🎯',
    title: 'Skin-Type Matching',
    desc: 'Tells each customer exactly which products suit their skin and which to avoid.',
  },
]

// ── Phone mockup (static conversation) ────────────────────────────────────────
function PhoneMockup({ type }: { type: BizType }) {
  const chat    = type === 'salon' ? SALON_CHAT : SHOP_CHAT
  const accent  = type === 'salon' ? 'bg-lavender' : 'bg-coral'
  const bubble  = type === 'salon' ? 'bg-lavender-light' : 'bg-coral-light'
  const bizName = type === 'salon' ? 'Glam Salon' : 'GlowUp Cosmetics'
  const bizIcon = type === 'salon' ? '💇' : '💄'

  return (
    <div className="relative mx-auto w-[265px]">
      {/* Glow */}
      <div className={`absolute inset-0 translate-x-4 translate-y-4 rounded-[44px] ${accent} opacity-20 blur-2xl pointer-events-none`} />

      <div className="relative rounded-[40px] border-[5px] border-[#2D3F57] bg-[#1E293B] shadow-2xl overflow-hidden animate-float">
        {/* Status bar */}
        <div className="flex justify-between items-center px-5 pt-3 pb-1">
          <span className="text-white/60 text-[10px]">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <div className="w-2 h-2 rounded-full bg-white/30" />
          </div>
        </div>

        {/* WhatsApp header */}
        <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${bubble} flex items-center justify-center text-sm flex-shrink-0`}>
            {bizIcon}
          </div>
          <div>
            <p className="text-white text-[11px] font-medium">{bizName}</p>
            <p className="text-white/60 text-[10px]">online · Nira AI</p>
          </div>
        </div>

        {/* Chat */}
        <div className="bg-[#ECE5DD] px-3 py-3 space-y-2" style={{ minHeight: 320 }}>
          {chat.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[185px] rounded-lg px-3 py-2 shadow-sm ${
                  msg.from === 'user'
                    ? `${bubble} text-right`
                    : 'bg-white'
                }`}
              >
                <p className="text-[10px] leading-relaxed whitespace-pre-line text-[#1E293B]">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function BusinessTypeFeatures() {
  const [active, setActive] = useState<BizType>('salon')

  const features = active === 'salon' ? SALON_FEATURES : SHOP_FEATURES

  return (
    <div>
      {/* ── Toggle ── */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mb-14">
        <button
          onClick={() => setActive('salon')}
          className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-medium text-sm transition-all ${
            active === 'salon'
              ? 'bg-lavender text-white shadow-xl shadow-lavender/30 scale-[1.02]'
              : 'bg-white border-2 border-nira-border text-slate-500 hover:border-lavender hover:text-lavender-dark'
          }`}
        >
          <span className="text-2xl">💇</span>
          <div className="text-left">
            <p className="font-medium">Salon &amp; Spa</p>
            <p className={`text-xs ${active === 'salon' ? 'text-white/70' : 'text-slate-400'}`}>Bookings, services &amp; scheduling</p>
          </div>
        </button>

        <button
          onClick={() => setActive('shop')}
          className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-medium text-sm transition-all ${
            active === 'shop'
              ? 'bg-coral text-white shadow-xl shadow-coral/30 scale-[1.02]'
              : 'bg-white border-2 border-nira-border text-slate-500 hover:border-coral hover:text-coral'
          }`}
        >
          <span className="text-2xl">💄</span>
          <div className="text-left">
            <p className="font-medium">Cosmetic Shop</p>
            <p className={`text-xs ${active === 'shop' ? 'text-white/70' : 'text-slate-400'}`}>Products, AI advice &amp; orders</p>
          </div>
        </button>
      </div>

      {/* ── Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

        {/* Left — phone */}
        <div className="flex justify-center">
          <PhoneMockup type={active} />
        </div>

        {/* Right — features */}
        <div>
          <h3 className="font-serif text-3xl text-[#1E293B] leading-snug mb-3">
            {active === 'salon'
              ? 'Everything Your Salon or Spa Needs'
              : 'Your Shop\'s 24/7 AI Sales Assistant'}
          </h3>
          <p className="text-slate-500 leading-relaxed mb-8">
            {active === 'salon'
              ? 'From the first "hello" to the booking confirmation and follow-up reminder — Nira handles the entire customer journey so you can focus on delivering great service.'
              : "Nira turns every WhatsApp message into a sale. It advises, recommends, answers product questions and takes orders — automatically, even while you sleep."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group flex gap-3 p-4 bg-white rounded-2xl border border-nira-border shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl ${
                  active === 'salon' ? 'bg-lavender-light' : 'bg-coral-light'
                }`}>
                  {f.icon}
                </div>
                <div>
                  <p className="font-medium text-[#1E293B] text-sm mb-0.5">{f.title}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
