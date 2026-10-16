import Link from 'next/link'
import { DASHBOARD_REGISTER_URL, WHATSAPP_CHAT_URL, WHATSAPP_NUMBER } from '@/lib/links'
import AnimatedChat    from '@/components/AnimatedChat'
import AnimatedRevenue from '@/components/AnimatedRevenue'
import BusinessTypeFeatures from '@/components/BusinessTypeFeatures'
import Testimonials from '@/components/Testimonials'
import HeroAsk         from '@/components/HeroAsk'
import HeroVisual      from '@/components/HeroVisual'
import ProductDemo     from '@/components/ProductDemo'
import SurfaceShowcase, { MarketplaceScreen } from '@/components/SurfaceShowcase'
import { PRICING } from '@/lib/pricing'
import HowItWorksFlow  from '@/components/HowItWorksFlow'
import {
  FadeUp,
  FadeIn,
  SlideLeft,
  SlideRight,
  StaggerContainer,
  StaggerItem,
  ScaleIn,
  Parallax,
  CountUp,
  TiltCard,
  AmbientGlow,
} from '@/components/animations'

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

// Dashboard phone mockup — stats count up and bookings stagger in once
// scrolled into view, phone responds to cursor tilt, glow drifts gently.
function DashboardPhone() {
  return (
    <div className="relative mx-auto w-[265px]">
      <AmbientGlow color="#B8A9E0" className="rounded-[44px]" direction="left" />
      <div className="animate-float" style={{ animationDelay: '1s' }}>
      <TiltCard max={6}>
      <div className="relative rounded-[40px] border-[5px] border-[#2D3F57] bg-[#1E293B] shadow-2xl overflow-hidden">
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
        <StaggerContainer className="bg-[#F8F7FF] px-3 py-3 grid grid-cols-2 gap-2">
          {[
            { label: "Today's Bookings", value: <CountUp to={8} />,               sub: '↑ +2 more', subColor: 'text-mint-dark' },
            { label: 'Revenue Today',    value: <>TZS <CountUp to={480} suffix="K" /></>, sub: '+23%', subColor: 'text-mint-dark' },
            { label: 'Customers',        value: <CountUp to={124} />,             sub: '+12 new', subColor: 'text-lavender-dark' },
            { label: 'Bot Active',       value: '24/7',                          sub: '● online', subColor: 'text-mint-dark' },
          ].map((s, i) => (
            <StaggerItem key={i}>
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <p className="text-[9px] text-slate-400 mb-0.5 leading-tight">{s.label}</p>
                <p className="text-sm font-serif text-[#1E293B]">{s.value}</p>
                <p className={`text-[9px] font-medium ${s.subColor}`}>{s.sub}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
        <div className="bg-white px-3 py-3">
          <p className="text-[10px] font-medium text-slate-400 mb-2 uppercase tracking-wide">Upcoming Bookings</p>
          <StaggerContainer>
            {[
              { name: 'Amina K.',  service: 'Classic Facial', time: '10:00 AM' },
              { name: 'Rehema M.', service: 'Manicure',       time: '11:30 AM' },
            ].map((b, i) => (
              <StaggerItem key={i}>
                <div className="flex items-center gap-2 py-2 border-b border-slate-50 last:border-0">
                  <div className="w-7 h-7 rounded-full bg-lavender-light flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-medium text-lavender-dark">{b.name[0]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-[#1E293B]">{b.name}</p>
                    <p className="text-[9px] text-slate-400">{b.service}</p>
                  </div>
                  <span className="text-[9px] font-medium text-coral">{b.time}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
      </TiltCard>
      </div>
    </div>
  )
}

// Marketplace phone mockup — reuses SurfaceShowcase's own MarketplaceScreen
// animation (radar ping → business card slides up with rating/distance →
// a review fades in) inside the same phone-frame shell as DashboardPhone
// above, so this new feature block matches its siblings visually without
// re-implementing the animation a second time.
function MarketplacePhone() {
  return (
    <div className="relative mx-auto w-[265px]">
      <AmbientGlow color="#6BCFB8" className="rounded-[44px]" direction="right" />
      <div className="animate-float" style={{ animationDelay: '0.5s' }}>
        <TiltCard max={6}>
          <div className="relative rounded-[40px] border-[5px] border-[#2D3F57] bg-[#1E293B] shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center px-6 pt-3 pb-1">
              <span className="text-white/80 text-[10px]">9:41</span>
            </div>
            <div style={{ height: 328 }}>
              <MarketplaceScreen />
            </div>
          </div>
        </TiltCard>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="font-sans">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-24 nira-section-light"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        {/* ambient brand light */}
        <div className="pointer-events-none absolute -top-40 right-[-10%] h-[620px] w-[620px] rounded-full bg-coral opacity-[0.07] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-40 left-[-10%] h-[480px] w-[480px] rounded-full bg-lavender opacity-[0.10] blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">

            {/* Left — the promise + the one thing to do: ask */}
            <div className="max-w-[600px]">
              <FadeUp delay={0.1}>
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[13px] font-medium"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)' }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-60" style={{ animation: 'radar-ping 1.8s ease-out infinite' }} />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
                  </span>
                  Your AI beauty agent · Dar es Salaam
                </span>
              </FadeUp>

              <FadeUp delay={0.2}>
                <h1
                  className="mt-6 font-serif text-[40px] leading-[1.06] tracking-[-0.01em] sm:text-[52px] lg:text-[56px] xl:text-[60px]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  The beauty world,
                  <br />
                  <span className="text-coral sm:whitespace-nowrap">in one conversation.</span>
                </h1>
              </FadeUp>

              <FadeUp delay={0.3}>
                <p className="mt-5 max-w-lg text-[17px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Tell Nira what you need. She finds the right salon or product, compares prices and reviews,
                  and books or orders for you — in Kiswahili or English.
                </p>
              </FadeUp>

              <FadeUp delay={0.4}>
                <div className="mt-8">
                  <HeroAsk />
                </div>
              </FadeUp>

              <FadeUp delay={0.5}>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] font-medium">
                  <Link href="/explore" className="group inline-flex items-center gap-1.5 hover:text-coral" style={{ color: 'var(--text-primary)' }}>
                    Explore businesses
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <a href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-coral" style={{ color: 'var(--text-secondary)' }}>
                    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                  <Link href={DASHBOARD_REGISTER_URL} className="inline-flex items-center gap-1.5 hover:text-coral" style={{ color: 'var(--text-secondary)' }}>
                    For businesses
                  </Link>
                </div>
              </FadeUp>

              <FadeUp delay={0.6}>
                <dl className="mt-10 grid max-w-md grid-cols-3 divide-x border-t pt-6" style={{ borderColor: 'var(--border)' }}>
                  {[
                    { value: <CountUp to={500} suffix="+" />, label: 'Businesses' },
                    { value: '24/7', label: 'Always on' },
                    { value: 'Free', label: 'To use' },
                  ].map((st, idx) => (
                    <div key={st.label} className={idx === 0 ? 'pr-4' : 'px-4'} style={{ borderColor: 'var(--border)' }}>
                      <dd className="font-serif text-[26px] leading-none" style={{ color: 'var(--text-primary)' }}>{st.value}</dd>
                      <dt className="mt-1.5 text-[13px]" style={{ color: 'var(--text-muted)' }}>{st.label}</dt>
                    </div>
                  ))}
                </dl>
              </FadeUp>
            </div>

            {/* Right — a live example of Nira at work */}
            <FadeIn delay={0.3}>
              <HeroVisual />
            </FadeIn>
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

        {/* Feature 5 — Marketplace Discovery */}
        <div className="py-24" style={{ backgroundColor: 'var(--bg-surface-2)' }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <SlideLeft delay={0.15} className="flex justify-center order-2 lg:order-1">
                <MarketplacePhone />
              </SlideLeft>
              <FadeUp className="order-1 lg:order-2">
                <span className="text-xs font-medium text-mint-dark uppercase tracking-widest">05 · Marketplace Discovery</span>
                <h2 className="font-serif text-4xl mt-3 mb-5 leading-snug" style={{ color: 'var(--text-primary)' }}>
                  Get Found by New Customers
                </h2>
                <p className="leading-relaxed mb-7" style={{ color: 'var(--text-secondary)' }}>
                  Your business joins Nira&apos;s growing beauty marketplace automatically. When someone nearby asks Nira for a service you offer, even a customer who&apos;s never heard of you, you&apos;re part of the answer.
                </p>
                <StaggerContainer>
                  <ul className="space-y-3">
                    {[
                      'Discovered by customers searching nearby, not just people who already know you',
                      'Shown with your real rating, right alongside other businesses',
                      'No extra listing fee — every active business is included automatically',
                      'Customers can book or order the moment they find you, without leaving the chat',
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
            </div>
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

      {/* ── FOR CUSTOMERS ─────────────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <span className="text-xs font-medium text-lavender-dark uppercase tracking-widest">For Customers</span>
            <h2 className="font-serif text-4xl mt-3 max-w-2xl mx-auto leading-snug" style={{ color: 'var(--text-primary)' }}>
              Book a Salon or Order Skincare — Without Leaving WhatsApp
            </h2>
            <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              No app to install, no account to create. Message Nira like you&apos;d message a friend, and get real answers, real bookings, in Swahili or English.
            </p>
          </FadeUp>

          {/* Benefit cards */}
          <StaggerContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
              {[
                {
                  iconBg: 'bg-coral-light text-coral',
                  title: 'Instant Answers, Day or Night',
                  desc: 'Ask about prices, ingredients, or open slots and get a real reply in seconds — even at 3 AM.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
                {
                  iconBg: 'bg-lavender-light text-lavender-dark',
                  title: 'Book or Order Right in Chat',
                  desc: 'Confirm a time or place an order without filling out a single form or downloading anything.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-9 0h10a1 1 0 011 1v10a2 2 0 01-2 2H8a2 2 0 01-2-2V8a1 1 0 011-1z" />
                    </svg>
                  ),
                },
                {
                  iconBg: 'bg-mint-light text-mint-dark',
                  title: 'Discover Businesses Nearby',
                  desc: "Don't have a salon yet? Tell Nira what you need and get matched with businesses near you.",
                  icon: <PinIcon className="w-6 h-6" />,
                },
                {
                  iconBg: 'bg-coral-light text-coral',
                  title: 'Swahili or English, Your Call',
                  desc: 'Every conversation happens in whichever language you pick first — switch anytime.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m0 13l4-8 4 8m-7.5-2h7M9 5c0 4.5-2 8-5.5 9.5" />
                    </svg>
                  ),
                },
              ].map((b) => (
                <StaggerItem key={b.title}>
                  <TiltCard className="h-full">
                    <div
                      className="card-hover h-full rounded-2xl p-6"
                      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${b.iconBg}`}>
                        {b.icon}
                      </div>
                      <h3 className="font-serif text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{b.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{b.desc}</p>
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          {/* How a customer starts */}
          <div className="rounded-3xl overflow-hidden bg-nira-dark relative">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-mint opacity-[0.05] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
            <div className="px-6 py-16 relative">
              <FadeUp className="text-center mb-12">
                <span className="text-xs font-medium text-mint-dark uppercase tracking-widest">How to Start</span>
                <h3 className="font-serif text-3xl text-white mt-3">Three Messages Away</h3>
              </FadeUp>

              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                  {
                    step: '01',
                    title: 'Message Nira',
                    desc: `Save ${WHATSAPP_NUMBER.replace(/^255(\d{2})(\d{3})(\d{4})$/, '+255 $1 $2 $3')} or tap the button below, then just say hi.`,
                  },
                  {
                    step: '02',
                    title: 'Tell Nira What You Need',
                    desc: 'Have a business’s code already? Type it. Otherwise describe what you’re looking for, like "facial in Dar."',
                  },
                  {
                    step: '03',
                    title: 'Book, Order, Done',
                    desc: 'Confirm the details right there in the chat. No hold music, no waiting for a callback.',
                  },
                ].map((s) => (
                  <FadeUp key={s.step} delay={Number(s.step) * 0.05}>
                    <p className="step-num font-serif text-3xl mb-2">{s.step}</p>
                    <h4 className="font-serif text-lg text-white mb-2">{s.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                  </FadeUp>
                ))}
              </div>

              <FadeUp className="text-center">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <a
                    href={WHATSAPP_CHAT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-press inline-flex items-center gap-2 bg-mint text-[#0B3B30] font-medium px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat with Nira Now
                  </a>
                  <Link
                    href="/chat"
                    className="btn-press inline-flex items-center gap-2 bg-transparent border border-white/40 text-white font-medium px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    ✨ Chat on the web
                  </Link>
                </div>
                <p className="text-slate-500 text-xs mt-3">Free to chat. No sign-up needed.</p>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ───────────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-surface-2)' }}>
        <div className="mx-auto max-w-6xl px-6">
          <FadeUp className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-medium uppercase tracking-widest text-coral">Pricing for businesses</span>
            <h2 className="mt-3 font-serif text-4xl" style={{ color: 'var(--text-primary)' }}>No monthly pressure</h2>
            <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
              Join once, get listed for free, and pay commission only when Nira brings you a completed booking or order.
            </p>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PRICING.map((item) => (
              <StaggerItem key={item.id}>
                <div
                  className="group flex h-full flex-col rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:border-coral/50 hover:shadow-card-hover"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
                >
                  <span
                    className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-medium ${item.tier === 'core' ? 'bg-coral-light text-coral-deep' : 'bg-lavender-light text-lavender-deep'}`}
                  >
                    {item.tier === 'core' ? item.billing : 'Optional'}
                  </span>
                  <p className="mt-4 text-[15px] font-medium" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                  <p className="mt-auto pt-3 text-[13px]" style={{ color: 'var(--text-muted)' }}>{item.amount ?? item.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeUp>
            <p className="mt-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              Standard marketplace listing is always free.{' '}
              <Link href="/pricing" className="font-medium text-coral hover:underline">See how pricing works →</Link>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <Testimonials />

      {/* ── DOWNLOAD CTA ──────────────────────────────────────────────── */}
      <section id="download" className="px-4 pb-20 pt-4 sm:px-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <ScaleIn>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-gradient-to-br from-coral via-[#ff7f7f] to-[#E55555] px-6 py-12 sm:px-12 md:py-14">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[40px] border-white/10" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />

            <div className="relative grid items-center gap-8 md:grid-cols-[1.6fr_1fr]">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/75">Start today · No monthly subscription</p>
                <h2 className="mt-3 font-serif text-[32px] leading-tight text-white md:text-[38px]">
                  Grow your beauty business <span className="whitespace-nowrap">with AI</span>
                </h2>
                <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-white/85">
                  Join 500+ beauty businesses in East Africa using Nira to serve customers 24/7. Low-cost to start, no technical skills needed.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:items-end">
                <Link
                  href={DASHBOARD_REGISTER_URL}
                  className="btn-press group inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 text-[16px] font-medium text-coral-dark shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl md:w-[260px]"
                >
                  Get started with Nira
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a
                  href={WHATSAPP_CHAT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-press inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/40 px-7 text-[15px] font-medium text-white transition-colors hover:bg-white/10 md:w-[260px]"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </ScaleIn>
      </section>

    </div>
  )
}
