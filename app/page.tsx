import Link from 'next/link'
import AnimatedChat    from '../components/AnimatedChat'
import AnimatedRevenue from '../components/AnimatedRevenue'
import ProductDemo          from '../components/ProductDemo'
import BusinessTypeFeatures from '../components/BusinessTypeFeatures'
import Reveal          from '../components/Reveal'

function Check({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

// Dashboard phone mockup (static — for bookings feature)
function DashboardPhone() {
  return (
    <div className="relative mx-auto w-[265px]">
      <div className="absolute inset-0 -translate-y-4 -translate-x-4 rounded-[44px] bg-lavender opacity-20 blur-3xl pointer-events-none" />
      <div className="relative rounded-[40px] border-[5px] border-[#2D3F57] bg-[#1E293B] shadow-2xl overflow-hidden animate-float" style={{ animationDelay: '1s' }}>
        <div className="flex justify-between items-center px-6 pt-3 pb-1">
          <span className="text-white/80 text-[10px]">9:41</span>
        </div>
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100">
          <div>
            <p className="text-[10px] text-slate-400">Good morning 👋</p>
            <p className="text-sm font-medium text-[#1E293B]">Glam Beauty Salon</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-coral-light flex items-center justify-center">
            <span className="text-[11px] font-medium text-coral">G</span>
          </div>
        </div>
        <div className="bg-[#F8F7FF] px-3 py-3 grid grid-cols-2 gap-2">
          {[
            { label: "Today's Bookings", value: '8', sub: '↑ +2 more', subColor: 'text-mint-dark' },
            { label: 'Revenue Today',    value: 'TZS 480K', sub: '+23%', subColor: 'text-mint-dark' },
            { label: 'Customers',        value: '124', sub: '+12 new', subColor: 'text-lavender-dark' },
            { label: 'Bot Active',       value: '24/7', sub: '● online', subColor: 'text-mint-dark' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
              <p className="text-[9px] text-slate-400 mb-0.5 leading-tight">{s.label}</p>
              <p className="text-sm font-serif text-[#1E293B]">{s.value}</p>
              <p className={`text-[9px] font-medium ${s.subColor}`}>{s.sub}</p>
            </div>
          ))}
        </div>
        <div className="bg-white px-3 py-3">
          <p className="text-[10px] font-medium text-slate-400 mb-2 uppercase tracking-wide">Upcoming Bookings</p>
          {[
            { name: 'Amina K.',  service: 'Classic Facial', time: '10:00 AM' },
            { name: 'Rehema M.', service: 'Manicure',       time: '11:30 AM' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2 py-2 border-b border-slate-50 last:border-0">
              <div className="w-7 h-7 rounded-full bg-lavender-light flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-medium text-lavender-dark">{b.name[0]}</span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-medium text-[#1E293B]">{b.name}</p>
                <p className="text-[9px] text-slate-400">{b.service}</p>
              </div>
              <span className="text-[9px] font-medium text-coral">{b.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="font-sans">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 overflow-hidden bg-white">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-coral opacity-[0.04] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-lavender opacity-[0.06] -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <div className="hero-anim-1 inline-flex items-center gap-2 bg-coral-light text-coral text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <span>🇹🇿</span>
                <span>Built for East Africa</span>
              </div>
              <h1 className="hero-anim-2 font-serif text-5xl lg:text-[58px] text-[#1E293B] leading-[1.1] mb-6">
                Your Beauty Business,{' '}
                <span className="text-coral">On Autopilot.</span>
              </h1>
              <p className="hero-anim-3 text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
                Connect WhatsApp. Let Nira handle bookings, product inquiries and customer support — in Swahili or English — while you focus on your craft.
              </p>
              <div className="hero-anim-4 flex flex-wrap gap-4 mb-10">
                <Link
                  href="/#download"
                  className="btn-shimmer inline-flex items-center gap-2 text-white font-medium px-7 py-3.5 rounded-full shadow-lg shadow-coral/30 hover:shadow-xl hover:shadow-coral/40 transition-shadow"
                >
                  Download Free App
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/#how-it-works"
                  className="inline-flex items-center gap-2 border border-nira-border text-slate-600 hover:border-coral hover:text-coral font-medium px-7 py-3.5 rounded-full transition-colors"
                >
                  See how it works
                </Link>
              </div>
              {/* Stats */}
              <div className="hero-anim-4 flex flex-wrap gap-8">
                {[
                  { value: '500+', label: 'Active businesses' },
                  { value: '24/7', label: 'AI support' },
                  { value: 'Free', label: 'To get started' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-serif text-2xl text-[#1E293B]">{s.value}</p>
                    <p className="text-sm text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — animated chat phone */}
            <div className="flex justify-center lg:justify-end">
              <AnimatedChat />
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────── */}
      <section className="py-10 border-y border-nira-border bg-nira-bg">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-[11px] text-slate-400 font-medium uppercase tracking-widest mb-5">
            Trusted by beauty businesses across Tanzania &amp; Kenya
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['💇 Salons', '🧖 Spas', '💄 Cosmetic Shops', '💅 Nail Bars', '✂️ Hair Studios', '🪒 Barbershops'].map((t) => (
              <span key={t} className="text-sm font-medium text-slate-600 bg-white border border-nira-border px-4 py-2 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────── */}
      <section id="features">

        {/* Feature 1 — Auto-reply */}
        <div className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <span className="text-xs font-medium text-coral uppercase tracking-widest">01 — Instant Replies</span>
                <h2 className="font-serif text-4xl text-[#1E293B] mt-3 mb-5 leading-snug">
                  Never Miss a Customer Message Again
                </h2>
                <p className="text-slate-500 leading-relaxed mb-7">
                  Nira responds to every WhatsApp message in seconds — even at 3 AM. Prices, availability, product details — answered instantly in your customer&apos;s language.
                </p>
                <ul className="space-y-3">
                  {[
                    'Swahili + English — customer chooses their language',
                    'Instant replies to pricing, services & product questions',
                    'Custom welcome messages that match your brand voice',
                    'Smart AI handles anything outside the standard menu',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className="text-mint-dark" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={150} className="flex justify-center">
                <AnimatedChat />
              </Reveal>
            </div>
          </div>
        </div>

        {/* Feature 2 — Bookings */}
        <div className="py-24 bg-nira-bg">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal delay={150} className="flex justify-center order-2 lg:order-1">
                <DashboardPhone />
              </Reveal>
              <Reveal className="order-1 lg:order-2">
                <span className="text-xs font-medium text-lavender-dark uppercase tracking-widest">02 — Smart Bookings</span>
                <h2 className="font-serif text-4xl text-[#1E293B] mt-3 mb-5 leading-snug">
                  Fill Your Calendar Without Lifting a Finger
                </h2>
                <p className="text-slate-500 leading-relaxed mb-7">
                  Customers book appointments directly through WhatsApp. Nira handles the entire flow — service selection, date, time, and confirmation — automatically.
                </p>
                <ul className="space-y-3">
                  {[
                    'Guided booking flow entirely inside WhatsApp chat',
                    'All appointments sync to your mobile dashboard instantly',
                    'See today\'s full schedule at a glance on your phone',
                    'Customers get automatic booking confirmation messages',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className="text-lavender-dark" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Feature 3 — Revenue */}
        <div className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <span className="text-xs font-medium text-mint-dark uppercase tracking-widest">03 — Revenue & Analytics</span>
                <h2 className="font-serif text-4xl text-[#1E293B] mt-3 mb-5 leading-snug">
                  Real-Time Revenue. Beautiful Results.
                </h2>
                <p className="text-slate-500 leading-relaxed mb-7">
                  Watch your revenue grow on a live dashboard. Track bookings, top products, and customer trends — all from your phone with animated, easy-to-read charts.
                </p>
                <ul className="space-y-3">
                  {[
                    'Animated revenue bar chart updates in real time',
                    'Best-selling products & most popular services',
                    'Customer activity — who spends most with you',
                    'Weekly & monthly comparisons at a glance',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className="text-mint-dark" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={150} className="flex justify-center">
                <AnimatedRevenue />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── BUSINESS TYPE FEATURES ────────────────────────────────────── */}
      <section className="py-24 bg-nira-bg">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-14">
            <span className="text-xs font-medium text-coral uppercase tracking-widest">04 — Built for Your Business</span>
            <h2 className="font-serif text-4xl text-[#1E293B] mt-3 mb-4">
              Tailored for Salons &amp; Cosmetic Shops
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Nira adapts to your business type. Whether you run a salon, spa, or cosmetic shop — every feature is built around how your customers interact with you on WhatsApp.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <BusinessTypeFeatures />
          </Reveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-nira-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-coral opacity-[0.04] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-lavender opacity-[0.05] -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative">
          <Reveal className="text-center mb-16">
            <span className="text-xs font-medium text-coral uppercase tracking-widest">Simple Setup</span>
            <h2 className="font-serif text-4xl text-white mt-3">Up and Running in Minutes</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              No technical skills required. If you have a WhatsApp Business number, you&apos;re ready.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Download & Register',
                desc: 'Download the Nira app and create your business account. Choose your business type — salon, spa, or cosmetic shop.',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 4.5h3" />
                  </svg>
                ),
                delay: 0,
              },
              {
                step: '02',
                title: 'Connect WhatsApp',
                desc: 'Link your existing WhatsApp Business number. Nira gives you a one-click setup URL — paste it in Meta Business Suite.',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                ),
                delay: 100,
              },
              {
                step: '03',
                title: 'Nira Does the Rest',
                desc: 'Add your services or products, activate the bot, and watch Nira handle every customer message 24/7.',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
                delay: 200,
              },
            ].map((item) => (
              <Reveal key={item.step} delay={item.delay}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 hover:border-white/20 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-coral/10 border border-coral/20 flex items-center justify-center text-coral mb-5">
                    {item.icon}
                  </div>
                  <p className="step-num font-serif text-3xl mb-2">{item.step}</p>
                  <h3 className="font-serif text-xl text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ───────────────────────────────────────────── */}
      <section className="py-24 bg-nira-bg">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-14">
            <span className="text-xs font-medium text-coral uppercase tracking-widest">Pricing</span>
            <h2 className="font-serif text-4xl text-[#1E293B] mt-3">Simple, Honest Pricing</h2>
            <p className="text-slate-500 mt-4">Start free. Upgrade when you&apos;re ready to grow.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: 'Free',
                price: 'TZS 0',
                desc: 'Perfect for getting started',
                features: ['100 messages/month', '1 user', 'Basic bot replies', 'Bookings & orders'],
                cta: 'Get started free',
                highlight: false,
              },
              {
                name: 'Pro',
                price: 'TZS 25,000',
                desc: 'For growing businesses',
                features: ['Unlimited messages', '3 users', 'AI skincare advice', 'Full analytics', 'Broadcasts'],
                cta: 'Start free trial',
                highlight: true,
              },
              {
                name: 'Business',
                price: 'TZS 50,000',
                desc: 'For established businesses',
                features: ['Unlimited messages', '10 users', 'Everything in Pro', 'Custom bot flows', 'Priority support'],
                cta: 'Start free trial',
                highlight: false,
              },
            ].map((plan, i) => (
              <Reveal key={plan.name} delay={i * 80}>
                <div
                  className={`relative rounded-2xl p-7 h-full ${
                    plan.highlight
                      ? 'bg-coral text-white shadow-2xl shadow-coral/30 md:-mt-3 md:mb-3'
                      : 'bg-white border border-nira-border'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1E293B] text-white text-[11px] font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className={`text-sm font-medium mb-1 ${plan.highlight ? 'text-white/70' : 'text-slate-400'}`}>{plan.name}</h3>
                  <p className={`font-serif text-3xl mb-1 ${plan.highlight ? 'text-white' : 'text-[#1E293B]'}`}>{plan.price}<span className={`text-sm font-sans ml-1 ${plan.highlight ? 'text-white/60' : 'text-slate-400'}`}>/mo</span></p>
                  <p className={`text-sm mb-5 ${plan.highlight ? 'text-white/80' : 'text-slate-500'}`}>{plan.desc}</p>
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className={`flex items-center gap-2.5 text-sm ${plan.highlight ? 'text-white/90' : 'text-slate-600'}`}>
                        <svg className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-mint-dark'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/pricing"
                    className={`block text-center py-3 rounded-xl font-medium text-sm transition-colors ${
                      plan.highlight ? 'bg-white text-coral hover:bg-coral-light' : 'bg-coral text-white hover:bg-coral-dark'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="text-center text-sm text-slate-400">
              All paid plans include a 30-day free trial. No credit card required.{' '}
              <Link href="/pricing" className="text-coral hover:underline font-medium">View full pricing →</Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-14">
            <span className="text-xs font-medium text-coral uppercase tracking-widest">Testimonials</span>
            <h2 className="font-serif text-4xl text-[#1E293B] mt-3">Loved by Beauty Businesses</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: 'Before Nira, I spent 3 hours every day just answering WhatsApp. Now the bot handles everything and I focus on my clients. Bookings increased by 40% in the first month!',
                name: 'Fatuma Hassan',
                role: 'Owner, Glam Beauty Salon — Dar es Salaam',
                initials: 'FH',
                bg: 'bg-lavender-light',
                delay: 0,
              },
              {
                quote: 'My shop gets 200+ WhatsApp messages daily. Nira answers product questions, recommends the right creams for each skin type, and even takes orders. I no longer miss a single sale.',
                name: 'Grace Wanjiku',
                role: 'Owner, GlowUp Cosmetics — Nairobi',
                initials: 'GW',
                bg: 'bg-coral-light',
                delay: 100,
              },
            ].map((t) => (
              <Reveal key={t.name} delay={t.delay}>
                <div className="bg-nira-bg border border-nira-border rounded-2xl p-8 h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-coral" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-6 flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${t.bg} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm font-medium text-[#1E293B]">{t.initials}</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#1E293B] text-sm">{t.name}</p>
                      <p className="text-slate-400 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD CTA ──────────────────────────────────────────────── */}
      <section id="download" className="py-20 relative overflow-hidden">
        {/* Coral gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-coral via-[#ff8585] to-[#E55555]" />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white opacity-[0.06] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-white opacity-[0.06] -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="max-w-2xl mx-auto px-6 text-center relative">
          <Reveal>
            <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-4">Start Today — It&apos;s Free</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-5">
              Grow Your Beauty Business with AI
            </h2>
            <p className="text-white/80 text-lg mb-10 leading-relaxed">
              Join 500+ beauty businesses in East Africa using Nira to serve customers 24/7. Free to start, no technical skills needed.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <a href="#" className="flex items-center gap-3 bg-[#1E293B] hover:bg-[#2D3F57] text-white px-6 py-3.5 rounded-xl transition-colors shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-white/60 leading-none mb-0.5">Download on the</p>
                  <p className="text-sm font-medium leading-none">App Store</p>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 bg-[#1E293B] hover:bg-[#2D3F57] text-white px-6 py-3.5 rounded-xl transition-colors shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.18 23.76c.28.15.6.19.91.12l11.64-11.64L12 8.5 3.18 23.76zM20.68 9.8L17.5 8l-3.7 3.7 3.7 3.7 3.22-1.83c.92-.52.92-2.25-.04-2.77zM2.01.37C1.73.56 1.55.87 1.55 1.24v21.52c0 .37.18.68.46.87L13.5 12 2.01.37zM15.6 3.8L4.1.07c-.31-.1-.63-.06-.91.12L15.5 12.2 19.5 8.2l-3.9-4.4z"/>
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-white/60 leading-none mb-0.5">Get it on</p>
                  <p className="text-sm font-medium leading-none">Google Play</p>
                </div>
              </a>
            </div>
            <p className="text-white/50 text-sm">Free · iOS & Android · No credit card required</p>
          </Reveal>
        </div>
      </section>

    </div>
  )
}
