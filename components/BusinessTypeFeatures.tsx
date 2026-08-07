'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type BizType = 'salon' | 'shop'

// ── Chat data ──────────────────────────────────────────────────────────────────
const SALON_CHAT = [
  { from: 'user', text: 'Hi, do you have any facials available this week?' },
  { from: 'bot',  text: 'We do! Our Classic Facial is TZS 45,000 and takes about an hour. Want me to check a day for you?' },
  { from: 'user', text: 'Saturday morning if possible' },
  { from: 'bot',  text: 'Saturday 10:00 AM is open. Should I book that for you?' },
  { from: 'user', text: 'Yes please' },
  { from: 'bot',  text: 'Booked! Classic Facial, Saturday at 10:00 AM. I will remind you an hour before.' },
]

const SHOP_CHAT = [
  { from: 'user', text: 'Do you have something for oily skin?' },
  { from: 'bot',  text: 'Yes, our Niacinamide 10% Serum is a great fit. It controls oil, minimizes pores, and evens skin tone. TZS 42,000.' },
  { from: 'user', text: 'How do I use it?' },
  { from: 'bot',  text: 'Cleanse first, apply 3 to 4 drops, press gently into skin (do not rub), then follow with moisturizer. Best morning and evening.' },
  { from: 'user', text: "I'll take 2 bottles" },
  { from: 'bot',  text: 'Order confirmed, 2x Niacinamide Serum, total TZS 84,000. I will send delivery details next.' },
]

// ── Feature data ───────────────────────────────────────────────────────────────
const SALON_FEATURES = [
  {
    icon: '📅',
    title: 'Guided Booking Flow',
    desc: 'Customers book appointments step-by-step through WhatsApp, no calls, no back-and-forth.',
  },
  {
    icon: '💆',
    title: 'Service Menu & Pricing',
    desc: 'All services, durations and prices displayed automatically in every customer conversation.',
  },
  {
    icon: '🔔',
    title: 'Automatic Reminders',
    desc: 'Customers receive a reminder 1 hour before their appointment, cutting no-shows to zero.',
  },
  {
    icon: '📊',
    title: 'Daily Schedule View',
    desc: "See today's full booking list on your mobile dashboard the moment you open the app.",
  },
  {
    icon: '🎉',
    title: 'Promotions & Offers',
    desc: 'Broadcast seasonal deals to all your customers with one tap, fills slow days fast.',
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
    desc: 'Recommends the right products for each customer\'s skin type: oily, dry, sensitive or combo.',
  },
  {
    icon: '📋',
    title: 'Usage Instructions',
    desc: 'Sends step-by-step how-to guides for every product automatically through WhatsApp.',
  },
  {
    icon: '🛒',
    title: 'WhatsApp Orders',
    desc: 'Customers order products, confirm quantity and share delivery details, all inside the chat.',
  },
  {
    icon: '⚠️',
    title: 'Side Effects & Safety',
    desc: 'Shares cautions, patch-test advice and warnings for each product with every customer.',
  },
  {
    icon: '📦',
    title: 'Live Stock Awareness',
    desc: 'The bot only recommends products that are currently in stock, no broken promises.',
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
          className={`btn-press flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-medium text-sm transition-all ${
            active === 'salon'
              ? 'bg-lavender text-white shadow-xl shadow-lavender/30 scale-[1.02]'
              : 'border-2 hover:border-lavender hover:text-lavender-dark'
          }`}
          style={active === 'salon' ? undefined : { backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <span className="text-2xl">💇</span>
          <div className="text-left">
            <p className="font-medium">Salon &amp; Spa</p>
            <p className="text-xs" style={{ color: active === 'salon' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>Bookings, services &amp; scheduling</p>
          </div>
        </button>

        <button
          onClick={() => setActive('shop')}
          className={`btn-press flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-medium text-sm transition-all ${
            active === 'shop'
              ? 'bg-coral text-white shadow-xl shadow-coral/30 scale-[1.02]'
              : 'border-2 hover:border-coral hover:text-coral'
          }`}
          style={active === 'shop' ? undefined : { backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <span className="text-2xl">💄</span>
          <div className="text-left">
            <p className="font-medium">Cosmetic Shop</p>
            <p className="text-xs" style={{ color: active === 'shop' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>Products, AI advice &amp; orders</p>
          </div>
        </button>
      </div>

      {/* ── Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

        {/* Left — phone */}
        <div className="flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <PhoneMockup type={active} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right — features */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <h3 className="font-serif text-3xl leading-snug mb-3" style={{ color: 'var(--text-primary)' }}>
                {active === 'salon'
                  ? 'Everything Your Salon or Spa Needs'
                  : 'Your Shop\'s 24/7 AI Sales Assistant'}
              </h3>
              <p className="leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                {active === 'salon'
                  ? 'From the first "hello" to the booking confirmation and follow-up reminder, Nira handles the entire customer journey so you can focus on delivering great service.'
                  : "Nira turns every WhatsApp message into a sale. It advises, recommends, answers product questions and takes orders, automatically, even while you sleep."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.08 + i * 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="group flex gap-3 p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all"
                    style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl ${
                      active === 'salon' ? 'bg-lavender-light' : 'bg-coral-light'
                    }`}>
                      {f.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{f.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
