import Link from 'next/link'
import AnimatedChat    from '../components/AnimatedChat'
import AnimatedRevenue from '../components/AnimatedRevenue'
import BusinessTypeFeatures from '../components/BusinessTypeFeatures'
import BeautyShowcase  from '../components/BeautyShowcase'
import ProductDemo     from '../components/ProductDemo'
import SurfaceShowcase from '../components/SurfaceShowcase'
import PricingCards    from '../components/PricingCards'
import HowItWorksFlow  from '../components/HowItWorksFlow'
import {
  FadeUp,
  FadeIn,
  SlideLeft,
  SlideRight,
  StaggerContainer,
  StaggerItem,
  ScaleIn,
  WipeReveal,
  Parallax,
  CountUp,
  MagneticButton,
  TiltCard,
} from '../components/animations'

function Check({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function PinIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-3.5 h-3.5 flex-shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.5-4.2-7-7.7-7-11a7 7 0 1114 0c0 3.3-2.5 6.8-7 11z" />
      <circle cx="12" cy="10" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
      <section
        className="relative pt-28 pb-20 overflow-hidden nira-section-light"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-coral opacity-[0.04] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-lavender opacity-[0.06] -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>

              <FadeUp delay={0.2}>
                <h1
                  className="font-serif text-5xl lg:text-[58px] leading-[1.1] mb-6"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Your Beauty Business,{' '}
                  <span className="text-coral">Always On.</span>
                </h1>
              </FadeUp>

              <FadeUp delay={0.4}>
                <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                  Nira talks with your customers on WhatsApp like a real person would, books their appointments, and helps new customers find you nearby. In Swahili or English.
                </p>
              </FadeUp>

              <FadeUp delay={0.55}>
                <div className="flex flex-wrap gap-4 mb-10">
                  <MagneticButton>
                    <Link
                      href="/#download"
                      className="btn-shimmer btn-press inline-flex items-center gap-2 text-white font-medium px-7 py-3.5 rounded-full shadow-lg shadow-coral/30 hover:shadow-xl hover:shadow-coral/40 transition-shadow"
                    >
                      Download Free App
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </MagneticButton>
                  <Link
                    href="/#how-it-works"
                    className="btn-press inline-flex items-center gap-2 border border-nira-border font-medium px-7 py-3.5 rounded-full transition-colors hover:border-coral hover:text-coral"
                    style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
                  >
                    See how it works
                  </Link>
                </div>
              </FadeUp>

              <FadeUp delay={0.7}>
                <div className="flex flex-wrap gap-8">
                  {[
                    { value: 500, suffix: '+', label: 'Active businesses' },
                    { value: null, display: '24/7', label: 'AI support' },
                    { value: null, display: 'Free', label: 'To get started' },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="font-serif text-2xl" style={{ color: 'var(--text-primary)' }}>
                        {s.value !== null
                          ? <CountUp to={s.value} suffix={s.suffix} />
                          : s.display
                        }
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>

            {/* Right — beauty showcase, revealed with a diagonal wipe rather than a fade */}
            <WipeReveal delay={0.5} className="flex justify-center lg:justify-end" >
              <div style={{ width: '100%', maxWidth: 560, position: 'relative', paddingRight: 20 }}>
                <BeautyShowcase />
              </div>
            </WipeReveal>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────── */}
      <FadeIn>
        <section
          className="py-10 border-y"
          style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border)' }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-center text-[11px] font-medium uppercase tracking-widest mb-5" style={{ color: 'var(--text-muted)' }}>
              Trusted by beauty businesses across Tanzania &amp; Kenya
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Salons', 'Spas', 'Cosmetic Shops', 'Nail Bars', 'Hair Studios', 'Barbershops'].map((t) => (
                <span
                  key={t}
                  className="text-sm font-medium px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── STORY SECTION ─────────────────────────────────────────────── */}
      <section
        className="pt-24 pb-14 overflow-hidden"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <div className="max-w-6xl mx-auto px-6">

          {/* Section label */}
          <FadeUp className="text-center">
            <p className="text-xs font-medium uppercase tracking-[3px] text-coral mb-4">Our Story</p>
          </FadeUp>

          {/* Heading */}
          <FadeUp delay={0.1} className="text-center">
            <h2
              className="font-serif text-4xl lg:text-5xl leading-[1.2] mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              Helping Beauty Businesses Grow Beyond Limits
            </h2>
          </FadeUp>

          {/* Subtext */}
          <FadeUp delay={0.2} className="text-center">
            <p
              className="text-lg leading-[1.7] max-w-[580px] mx-auto mb-16"
              style={{ color: 'var(--text-secondary)' }}
            >
              They run the beauty industry.
              We build the tools to help them scale it
            </p>
          </FadeUp>

          {/* Three-column image story */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-16">

            {/* Column 1 */}
            <FadeUp delay={0}>
              <div className="group">
                <div className="overflow-hidden rounded-[20px] mb-4" style={{ height: 320 }}>
                  <Parallax offset={30} className="h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/grace.jpg"
                      alt="Grace runs 3 salons in Dar es Salaam"
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                      style={{ objectPosition: 'center top' }}
                      loading="lazy"
                    />
                  </Parallax>
                </div>
                <p className="text-[11px] font-medium uppercase tracking-[1.5px] text-coral mb-1">Dar es Salaam</p>
                <h3 className="font-serif text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Grace runs 3 salons</h3>
                <p className="text-sm leading-[1.6]" style={{ color: 'var(--text-secondary)' }}>
                  She uses Nira to manage bookings across all locations from one phone.
                </p>
              </div>
            </FadeUp>

            {/* Column 2 — offset down on desktop */}
            <FadeUp delay={0.15}>
              <div className="group md:mt-10">
                <div className="overflow-hidden rounded-[20px] mb-4" style={{ height: 320 }}>
                  <Parallax offset={20} className="h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/amina-makeup.jpg"
                      alt="Amina doubled her revenue in Nairobi"
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                      style={{ objectPosition: 'center top' }}
                      loading="lazy"
                    />
                  </Parallax>
                </div>
                <p className="text-[11px] font-medium uppercase tracking-[1.5px] text-coral mb-1">Dodoma</p>
                <h3 className="font-serif text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Amina doubled her revenue</h3>
                <p className="text-sm leading-[1.6]" style={{ color: 'var(--text-secondary)' }}>
                  Her WhatsApp bot now handles 80% of customer enquiries automatically.
                </p>
              </div>
            </FadeUp>

            {/* Column 3 */}
            <FadeUp delay={0.3}>
              <div className="group">
                <div className="overflow-hidden rounded-[20px] mb-4" style={{ height: 320 }}>
                  <Parallax offset={40} className="h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/fatuma-hair.jpg"
                      alt="Zainab sells products online in Mombasa"
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                      style={{ objectPosition: 'center top' }}
                      loading="lazy"
                    />
                  </Parallax>
                </div>
                <p className="text-[11px] font-medium uppercase tracking-[1.5px] text-coral mb-1">Arusha</p>
                <h3 className="font-serif text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Zainab sells products online</h3>
                <p className="text-sm leading-[1.6]" style={{ color: 'var(--text-secondary)' }}>
                  Customers order skincare through WhatsApp. Nira tracks every order automatically.
                </p>
              </div>
            </FadeUp>
          </div>

          {/* Bottom quote */}
          <FadeUp delay={0.1} className="text-center">
            <div className="relative max-w-[600px] mx-auto">
              <p
                className="font-serif absolute -top-8 left-0 select-none pointer-events-none"
                style={{ fontSize: 80, lineHeight: 1, color: 'var(--coral)', opacity: 0.18 }}
              >
                &ldquo;
              </p>
              <p
                className="font-serif text-2xl lg:text-[28px] leading-[1.5] italic px-8"
                style={{ color: 'var(--text-primary)' }}
              >
                If your business depends on replies, it shouldn’t depend on you.
              </p>
              <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                Nira team, Dar es Salaam
              </p>
            </div>
          </FadeUp>

        </div>
      </section>

      {/* ── THREE SURFACES (scroll-linked, the signature moment of this page) ── */}
      <section className="relative bg-nira-dark pt-14 pb-24 overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 text-center mb-16">
          <FadeUp>
            <span className="text-xs font-medium text-coral uppercase tracking-widest">One System</span>
            <h2 className="font-serif text-4xl mt-3 text-white leading-snug">
              Three Ways Nira Shows Up For You
            </h2>
          </FadeUp>
        </div>

        <FadeUp delay={0.1}>
          <SurfaceShowcase />
        </FadeUp>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────── */}
      <section id="features">

        {/* Feature 1 — Auto-reply */}
        <div className="py-24" style={{ backgroundColor: 'var(--bg-surface-2)' }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <FadeUp>
                <span className="text-xs font-medium text-coral uppercase tracking-widest">01 · Instant Replies</span>
                <h2 className="font-serif text-4xl mt-3 mb-5 leading-snug" style={{ color: 'var(--text-primary)' }}>
                  Never Miss a Customer Message Again
                </h2>
                <p className="leading-relaxed mb-7" style={{ color: 'var(--text-secondary)' }}>
                  Nira answers every WhatsApp message in seconds, even at 3 AM, with a real conversation instead of a canned reply. Prices, availability, product advice, all answered instantly in your customer&apos;s language.
                </p>
                <StaggerContainer>
                  <ul className="space-y-3">
                    {[
                      'Swahili and English, the customer chooses',
                      'Natural conversation, not a fixed menu of options',
                      'Custom welcome messages that match your brand voice',
                      'Handles anything a customer asks, not just the basics',
                    ].map((item) => (
                      <StaggerItem key={item}>
                        <li className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <Check className="text-mint-dark" />
                          {item}
                        </li>
                      </StaggerItem>
                    ))}
                  </ul>
                </StaggerContainer>
              </FadeUp>
              <SlideRight delay={0.15} className="flex justify-center">
                <AnimatedChat />
              </SlideRight>
            </div>
          </div>
        </div>

        {/* Feature 2 — Bookings */}
        <div className="py-24" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <SlideLeft delay={0.15} className="flex justify-center order-2 lg:order-1">
                <DashboardPhone />
              </SlideLeft>
              <FadeUp className="order-1 lg:order-2">
                <span className="text-xs font-medium text-lavender-dark uppercase tracking-widest">02 · Smart Bookings</span>
                <h2 className="font-serif text-4xl mt-3 mb-5 leading-snug" style={{ color: 'var(--text-primary)' }}>
                  Fill Your Calendar Without Lifting a Finger
                </h2>
                <p className="leading-relaxed mb-7" style={{ color: 'var(--text-secondary)' }}>
                  Customers book appointments directly through WhatsApp. Nira handles the whole flow: service, date, time, and confirmation, automatically.
                </p>
                <StaggerContainer>
                  <ul className="space-y-3">
                    {[
                      'Guided booking flow entirely inside WhatsApp chat',
                      'All appointments sync to your mobile dashboard instantly',
                      'See today\'s full schedule at a glance on your phone',
                      'Customers get automatic booking confirmation messages',
                    ].map((item) => (
                      <StaggerItem key={item}>
                        <li className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <Check className="text-lavender-dark" />
                          {item}
                        </li>
                      </StaggerItem>
                    ))}
                  </ul>
                </StaggerContainer>
              </FadeUp>
            </div>
          </div>
        </div>

        {/* Feature 3 — Revenue */}
        <div className="py-24" style={{ backgroundColor: 'var(--bg-surface-2)' }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <FadeUp>
                <span className="text-xs font-medium text-mint-dark uppercase tracking-widest">03 · Revenue &amp; Analytics</span>
                <h2 className="font-serif text-4xl mt-3 mb-5 leading-snug" style={{ color: 'var(--text-primary)' }}>
                  Real-Time Revenue. Beautiful Results.
                </h2>
                <p className="leading-relaxed mb-7" style={{ color: 'var(--text-secondary)' }}>
                  Watch your revenue grow on a live dashboard. Track bookings, top products, and customer trends, all from your phone with animated, easy-to-read charts.
                </p>
                <StaggerContainer>
                  <ul className="space-y-3">
                    {[
                      'Animated revenue bar chart updates in real time',
                      'Best-selling products and most popular services',
                      'Customer activity, see who spends most with you',
                      'Weekly and monthly comparisons at a glance',
                    ].map((item) => (
                      <StaggerItem key={item}>
                        <li className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <Check className="text-mint-dark" />
                          {item}
                        </li>
                      </StaggerItem>
                    ))}
                  </ul>
                </StaggerContainer>
              </FadeUp>
              <SlideRight delay={0.15} className="flex justify-center">
                <AnimatedRevenue />
              </SlideRight>
            </div>
          </div>
        </div>

        {/* Feature 4 — Product Intelligence */}
        <div className="py-24" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="max-w-6xl mx-auto px-6">
            <FadeUp className="text-center mb-14">
              <span className="text-xs font-medium text-lavender-dark uppercase tracking-widest">04 · Product Intelligence</span>
              <h2 className="font-serif text-4xl mt-3 mb-4" style={{ color: 'var(--text-primary)' }}>
                Nira Knows Every Product, So Your Customers Do Too
              </h2>
              <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Ask about ingredients, suitability, or how to use something. Nira answers with real product knowledge, automatically, on WhatsApp.
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <ProductDemo />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── BUSINESS TYPE FEATURES ────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-surface-2)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <span className="text-xs font-medium text-coral uppercase tracking-widest">05 · Built for Your Business</span>
            <h2 className="font-serif text-4xl mt-3 mb-4" style={{ color: 'var(--text-primary)' }}>
              Tailored for Salons &amp; Cosmetic Shops
            </h2>
            <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Nira adapts to your business type. Whether you run a salon, spa, or cosmetic shop, every feature is built around how your customers interact with you on WhatsApp.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <BusinessTypeFeatures />
          </FadeUp>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-nira-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-coral opacity-[0.04] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-lavender opacity-[0.05] -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative">
          <FadeUp className="text-center mb-16">
            <span className="text-xs font-medium text-coral uppercase tracking-widest">Simple Setup</span>
            <h2 className="font-serif text-4xl text-white mt-3">Up and Running in Minutes</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              No technical skills required, and no WhatsApp Business setup on your end. Nira runs on one shared number for everyone.
            </p>
          </FadeUp>

          <HowItWorksFlow
            steps={[
              {
                step: '01',
                title: 'Download & Register',
                desc: 'Download the Nira app and create your business account. Choose your business type: salon, spa, or cosmetic shop.',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 4.5h3" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Get Your Bot Code',
                desc: 'Nira runs on one shared WhatsApp number for every business on the platform. You get a bot code, like higrace or hinasby, so customers can type it or tap your link to reach your bot directly. No separate WhatsApp Business setup on your end.',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Nira Does the Rest',
                desc: 'Add your services or products, activate your bot, and Nira handles every message 24/7, whether a customer already had your code or found you through the Nira marketplace nearby.',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* ── PRICING PREVIEW ───────────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-surface-2)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <span className="text-xs font-medium text-coral uppercase tracking-widest">Pricing</span>
            <h2 className="font-serif text-4xl mt-3" style={{ color: 'var(--text-primary)' }}>Pick your power level</h2>
            <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Start free. Upgrade when you&apos;re ready to grow.</p>
          </FadeUp>

          <PricingCards />

          <FadeUp>
            <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              All paid plans include a 30-day free trial. No credit card required.{' '}
              <Link href="/pricing" className="text-coral hover:underline font-medium">View full pricing →</Link>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="py-24 overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-6xl mx-auto px-6">

          <FadeUp className="text-center mb-14">
            <span className="text-xs font-medium text-coral uppercase tracking-widest">Testimonials</span>
            <h2 className="font-serif text-4xl mt-3" style={{ color: 'var(--text-primary)' }}>
              Loved by Beauty Businesses
            </h2>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'Nira imebadilisha biashara yangu kabisa. Sasa wateja wanaweza kupanga miadi usiku wa manane na bot inawajibu papo hapo!',
                name: 'Grace Mwangi',
                business: 'Glam Beauty Salon · Dar es Salaam',
                avatar: (
                  <svg width="44" height="44" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                    <defs><clipPath id="av-grace"><circle cx="26" cy="26" r="26"/></clipPath></defs>
                    <g clipPath="url(#av-grace)">
                      <rect width="52" height="52" fill="#F0ECFB"/>
                      <rect x="21" y="35" width="10" height="10" rx="3" fill="#8B5E3C"/>
                      <ellipse cx="26" cy="28" rx="13" ry="14" fill="#8B5E3C"/>
                      <ellipse cx="26" cy="16" rx="14" ry="8" fill="#2C1810"/>
                      <ellipse cx="14" cy="22" rx="5" ry="7" fill="#2C1810"/>
                      <ellipse cx="38" cy="22" rx="5" ry="7" fill="#2C1810"/>
                      <ellipse cx="21" cy="27" rx="2.5" ry="2" fill="#1A0A00"/>
                      <ellipse cx="31" cy="27" rx="2.5" ry="2" fill="#1A0A00"/>
                      <ellipse cx="21.5" cy="26.5" rx="0.8" ry="0.6" fill="white"/>
                      <ellipse cx="31.5" cy="26.5" rx="0.8" ry="0.6" fill="white"/>
                      <ellipse cx="26" cy="31" rx="2" ry="1.2" fill="#7A5030"/>
                      <path d="M22 34 Q26 37 30 34" stroke="#5C2E0A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      <circle cx="13" cy="29" r="2" fill="#FF6B6B"/>
                      <circle cx="39" cy="29" r="2" fill="#FF6B6B"/>
                      <ellipse cx="26" cy="52" rx="18" ry="8" fill="#6B4226"/>
                    </g>
                  </svg>
                ),
              },
              {
                quote: 'I used to spend 3 hours a day just answering WhatsApp messages. Now Nira handles everything and I focus on my clients. Best decision I made.',
                name: 'Amina Hassan',
                business: 'Pure Glow Spa · Nairobi',
                avatar: (
                  <svg width="44" height="44" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                    <defs><clipPath id="av-amina"><circle cx="26" cy="26" r="26"/></clipPath></defs>
                    <g clipPath="url(#av-amina)">
                      <rect width="52" height="52" fill="#FFE8E8"/>
                      <rect x="21" y="35" width="10" height="10" rx="3" fill="#A0673A"/>
                      <ellipse cx="26" cy="28" rx="13" ry="14" fill="#A0673A"/>
                      <rect x="10" y="16" width="5" height="22" rx="2.5" fill="#3D1F00"/>
                      <rect x="37" y="16" width="5" height="22" rx="2.5" fill="#3D1F00"/>
                      <ellipse cx="26" cy="15" rx="14" ry="7" fill="#3D1F00"/>
                      <rect x="23.5" y="8" width="5" height="18" rx="2.5" fill="#3D1F00"/>
                      <ellipse cx="21" cy="27" rx="2.5" ry="2" fill="#1A0A00"/>
                      <ellipse cx="31" cy="27" rx="2.5" ry="2" fill="#1A0A00"/>
                      <ellipse cx="21.5" cy="26.5" rx="0.8" ry="0.6" fill="white"/>
                      <ellipse cx="31.5" cy="26.5" rx="0.8" ry="0.6" fill="white"/>
                      <ellipse cx="26" cy="31" rx="2" ry="1.2" fill="#8B5A2B"/>
                      <path d="M22 34 Q26 37.5 30 34" stroke="#6B3F15" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      <circle cx="13" cy="28" r="2.5" fill="none" stroke="#F5C842" strokeWidth="1.5"/>
                      <circle cx="39" cy="28" r="2.5" fill="none" stroke="#F5C842" strokeWidth="1.5"/>
                      <ellipse cx="26" cy="52" rx="18" ry="8" fill="#7A4F25"/>
                    </g>
                  </svg>
                ),
              },
              {
                quote: 'My cosmetics shop doubled orders in 2 months. Customers love how easy it is to order through WhatsApp. Nira is simply the best.',
                name: 'Zainab Ali',
                business: 'Zainab Beauty · Mombasa',
                avatar: (
                  <svg width="44" height="44" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                    <defs><clipPath id="av-zainab"><circle cx="26" cy="26" r="26"/></clipPath></defs>
                    <g clipPath="url(#av-zainab)">
                      <rect width="52" height="52" fill="#E4F7F3"/>
                      <rect x="21" y="35" width="10" height="10" rx="3" fill="#5C3317"/>
                      <ellipse cx="26" cy="29" rx="13" ry="13" fill="#5C3317"/>
                      <ellipse cx="26" cy="17" rx="16" ry="11" fill="#6BCFB8"/>
                      <ellipse cx="26" cy="14" rx="14" ry="7" fill="#4DB8A0"/>
                      <ellipse cx="26" cy="9" rx="7" ry="5" fill="#6BCFB8"/>
                      <rect x="10" y="20" width="7" height="16" rx="3" fill="#6BCFB8"/>
                      <rect x="35" y="20" width="7" height="16" rx="3" fill="#6BCFB8"/>
                      <ellipse cx="21" cy="28" rx="2.5" ry="2" fill="#1A0A00"/>
                      <ellipse cx="31" cy="28" rx="2.5" ry="2" fill="#1A0A00"/>
                      <ellipse cx="21.5" cy="27.5" rx="0.8" ry="0.6" fill="white"/>
                      <ellipse cx="31.5" cy="27.5" rx="0.8" ry="0.6" fill="white"/>
                      <ellipse cx="26" cy="32" rx="2" ry="1.2" fill="#4A2610"/>
                      <path d="M22 35 Q26 38 30 35" stroke="#3A1A06" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      <ellipse cx="26" cy="52" rx="18" ry="8" fill="#4A2610"/>
                    </g>
                  </svg>
                ),
              },
            ].map((t) => (
              <StaggerItem key={t.name}>
                <TiltCard className="h-full">
                <div
                  className="rounded-2xl p-7 h-full flex flex-col transition-shadow duration-300 hover:shadow-xl"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-coral" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote marks */}
                  <p
                    className="font-serif leading-none mb-3 select-none"
                    style={{ fontSize: 48, color: 'var(--coral)', opacity: 0.3 }}
                  >
                    &ldquo;
                  </p>

                  {/* Quote text */}
                  <p className="leading-[1.7] mb-6 flex-1 text-[15px]" style={{ color: 'var(--text-primary)' }}>
                    {t.quote}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div
                      className="flex-shrink-0 rounded-full overflow-hidden"
                      style={{ border: '2px solid var(--coral)', width: 44, height: 44 }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.business}</p>
                    </div>
                  </div>
                </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── DOWNLOAD CTA ──────────────────────────────────────────────── */}
      <section id="download" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-coral via-[#ff8585] to-[#E55555]" />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white opacity-[0.06] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-white opacity-[0.06] -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="max-w-2xl mx-auto px-6 text-center relative">
          <FadeUp>
            <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-4">Start Today. It&apos;s Free.</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-5">
              Grow Your Beauty Business with AI
            </h2>
            <p className="text-white/80 text-lg mb-10 leading-relaxed">
              Join 500+ beauty businesses in East Africa using Nira to serve customers 24/7. Free to start, no technical skills needed.
            </p>
          </FadeUp>

          {/* Scales into place rather than fading, the signature CTA moment of this page */}
          <ScaleIn delay={0.1}>
            <div
              className="inline-flex flex-wrap justify-center gap-4 mb-6 p-6 rounded-3xl"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <div className="flex items-center gap-3 bg-[#1E293B] text-white px-6 py-3.5 rounded-xl opacity-80">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-white/60 leading-none mb-0.5">Coming soon to the</p>
                  <p className="text-sm font-medium leading-none">App Store</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#1E293B] text-white px-6 py-3.5 rounded-xl opacity-80">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.18 23.76c.28.15.6.19.91.12l11.64-11.64L12 8.5 3.18 23.76zM20.68 9.8L17.5 8l-3.7 3.7 3.7 3.7 3.22-1.83c.92-.52.92-2.25-.04-2.77zM2.01.37C1.73.56 1.55.87 1.55 1.24v21.52c0 .37.18.68.46.87L13.5 12 2.01.37zM15.6 3.8L4.1.07c-.31-.1-.63-.06-.91.12L15.5 12.2 19.5 8.2l-3.9-4.4z"/>
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-white/60 leading-none mb-0.5">Coming soon to</p>
                  <p className="text-sm font-medium leading-none">Google Play</p>
                </div>
              </div>
            </div>
          </ScaleIn>

          <FadeUp delay={0.2}>
            <p className="text-white/70 text-sm mb-3">
              Ready now: message us directly and we will get you set up.
            </p>
            <a
              href="https://wa.me/255772630193"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press inline-flex items-center gap-2 bg-white text-coral-dark font-medium px-6 py-3 rounded-full hover:bg-coral-light transition-colors"
            >
              Chat on WhatsApp
            </a>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
