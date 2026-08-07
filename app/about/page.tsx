import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeUp, FadeIn, StaggerContainer, StaggerItem } from '../../components/animations'

export const metadata: Metadata = {
  title: 'About Us · Nira',
  description: 'Learn about Nira\'s mission to empower beauty businesses across East Africa with AI technology.',
}

function HeartIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7.5-4.9-10-9.3C.3 8.1 2 4.5 5.6 4c2-.3 3.9.7 4.9 2.3C11.5 4.7 13.4 3.7 15.4 4c3.6.5 5.3 4.1 3.6 7.7C16.5 16.1 12 21 12 21z" />
    </svg>
  )
}
function GlobeIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M3 12h18M12 3c2.5 2.5 4 5.7 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.7-4-9s1.5-6.5 4-9z" />
    </svg>
  )
}
function CompassIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9.5l-2 5-3 1.5 2-5 3-1.5z" />
    </svg>
  )
}
function ChartIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V10M12 20V4M20 20v-7" />
    </svg>
  )
}
function TelescopeIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l14-6-3 8-11-2zM14 6l6 4M8 14l-2 6M5 20l3-1" />
    </svg>
  )
}

const VALUES = [
  {
    Icon: HeartIcon,
    title: 'Customer First, Always',
    desc: 'Every feature we build starts with one question: does this genuinely help a salon owner or their customers? If not, we do not build it.',
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#FDE68A]',
    iconColor: 'text-[#B45309]',
  },
  {
    Icon: GlobeIcon,
    title: 'Made for Africa',
    desc: 'We build for our context: M-Pesa payments, Swahili conversations, limited internet, hot climates. We do not adapt Western products, we build from the ground up.',
    bg: 'bg-mint-light',
    border: 'border-mint',
    iconColor: 'text-mint-dark',
  },
  {
    Icon: CompassIcon,
    title: 'Simplicity by Design',
    desc: 'A salon owner should be able to set up Nira in under 10 minutes with no technical background. If it is complicated, we redesign it.',
    bg: 'bg-lavender-light',
    border: 'border-lavender',
    iconColor: 'text-lavender-dark',
  },
  {
    Icon: ChartIcon,
    title: 'Real Impact',
    desc: 'We measure success in real revenue growth, hours saved, and customer satisfaction for our users, not just app downloads or sign-ups.',
    bg: 'bg-coral-light',
    border: 'border-coral',
    iconColor: 'text-coral-dark',
  },
]

const TIMELINE = [
  {
    year: '2023',
    title: 'The Problem We Saw',
    desc: 'Walking through the streets of Dar es Salaam, we noticed salon owners glued to their phones, not for social media, but frantically answering hundreds of WhatsApp messages every single day. Bookings, prices, product questions. The same answers, over and over.',
    side: 'right',
  },
  {
    year: 'Early 2024',
    title: 'Building the First Version',
    desc: 'We built a simple WhatsApp bot for a friend\'s salon in Mikocheni. Within two weeks, she had saved 3 hours daily and booking confirmations went from 40% to 89%. We knew we were onto something.',
    side: 'left',
  },
  {
    year: 'Mid 2024',
    title: 'Expanding Across Tanzania',
    desc: 'Word spread fast. Cosmetic shops, spas, and nail bars started signing up. We added AI-powered product recommendations, analytics, and the mobile app so owners could manage everything from their phone.',
    side: 'right',
  },
  {
    year: '2025',
    title: 'A Real Conversation, Not a Menu',
    desc: 'We rebuilt the bot from the ground up around Claude, so customers get a real conversation instead of a fixed menu of numbered options. We also opened up marketplace discovery, so new customers can find a business before they have ever messaged it.',
    side: 'left',
  },
  {
    year: '2026',
    title: 'Growing Across East Africa',
    desc: 'Nira is now used by 500+ beauty businesses across Tanzania and Kenya. We are building toward a future where every beauty entrepreneur, from Mombasa to Mwanza, has enterprise-level AI tools in their pocket.',
    side: 'right',
  },
]

export default function AboutPage() {
  return (
    <div className="font-sans">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-24 overflow-hidden bg-nira-dark">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-coral opacity-[0.06] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-lavender opacity-[0.07] -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
              <GlobeIcon className="w-3.5 h-3.5" />
              <span>Made in Tanzania, built for Africa</span>
            </div>
          </FadeIn>
          <FadeUp delay={0.25}>
            <h1 className="font-serif text-5xl md:text-6xl text-white leading-tight mb-6">
              Empowering Every Beauty Entrepreneur in Africa
            </h1>
          </FadeUp>
          <FadeUp delay={0.4}>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
              We believe the woman running a salon in Kariakoo deserves the same intelligent tools as the biggest beauty chains in the world. Nira is how we make that happen.
            </p>
          </FadeUp>

          {/* Live stats */}
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { value: '500+',   label: 'Active Businesses' },
              { value: '2',      label: 'Countries' },
              { value: '24/7',   label: 'AI Support' },
              { value: '2024',   label: 'Founded' },
            ].map((s) => (
              <StaggerItem key={s.label}>
                <div className="bg-white/5 border border-white/10 rounded-2xl py-5 px-4 transition-colors hover:bg-white/10">
                  <p className="font-serif text-3xl text-white">{s.value}</p>
                  <p className="text-sm text-slate-400 mt-1">{s.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── MISSION & VISION ──────────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <span className="text-xs font-medium text-coral uppercase tracking-widest">Who We Are</span>
            <h2 className="font-serif text-4xl mt-3" style={{ color: 'var(--text-primary)' }}>Mission &amp; Vision</h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission — a deliberately fixed-dark accent card, by design, regardless of page theme */}
            <FadeUp>
              <div className="relative bg-nira-dark rounded-3xl p-8 overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-coral opacity-10 translate-x-1/3 -translate-y-1/3" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-coral/10 border border-coral/20 flex items-center justify-center mb-6">
                    <CompassIcon className="w-6 h-6 text-coral" />
                  </div>
                  <p className="text-xs font-medium text-coral uppercase tracking-widest mb-3">Our Mission</p>
                  <h3 className="font-serif text-2xl text-white mb-4 leading-snug">
                    Empower every beauty entrepreneur with intelligent tools that save time and grow revenue
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    We make AI accessible to beauty business owners who have never written a line of code, and never need to. Our tools work through WhatsApp, the app every business in East Africa already uses.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Vision */}
            <FadeUp delay={0.1}>
              <div
                className="relative rounded-3xl p-8 overflow-hidden h-full border"
                style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border)' }}
              >
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-lavender opacity-15 translate-x-1/3 -translate-y-1/3" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-lavender-light border border-lavender/30 flex items-center justify-center mb-6">
                    <TelescopeIcon className="w-6 h-6 text-lavender-dark" />
                  </div>
                  <p className="text-xs font-medium text-lavender-dark uppercase tracking-widest mb-3">Our Vision</p>
                  <h3 className="font-serif text-2xl mb-4 leading-snug" style={{ color: 'var(--text-primary)' }}>
                    A world where every salon in Africa competes with the very best, powered by AI
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    The corner salon in Mombasa should have the same competitive tools as a luxury spa in London. Geography and budget should not determine access to world-class business technology.
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── OUR STORY ─────────────────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <FadeUp className="text-center mb-16">
            <span className="text-xs font-medium text-coral uppercase tracking-widest">Our Story</span>
            <h2 className="font-serif text-4xl mt-3" style={{ color: 'var(--text-primary)' }}>From a Problem We Lived</h2>
            <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Nira was not born in a boardroom. It was born on the streets of Dar es Salaam.
            </p>
          </FadeUp>

          {/* Timeline */}
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px" style={{ backgroundColor: 'var(--border)' }} />

            <div className="space-y-10">
              {TIMELINE.map((item, i) => (
                <FadeUp key={i} delay={i * 0.08}>
                  <div className={`relative grid grid-cols-1 md:grid-cols-2 gap-6 ${item.side === 'left' ? '' : 'md:grid-flow-col-dense'}`}>
                    {/* Dot */}
                    <div
                      className="absolute left-4 md:left-1/2 top-6 w-3 h-3 rounded-full bg-coral shadow md:-translate-x-1.5"
                      style={{ border: '2px solid var(--bg-page)' }}
                    />

                    {item.side === 'right' ? (
                      <>
                        {/* Left: year */}
                        <div className="hidden md:flex justify-end pr-10 pt-5">
                          <span className="font-serif text-xl text-coral">{item.year}</span>
                        </div>
                        {/* Right: content */}
                        <div className="pl-10 md:pl-10">
                          <span className="md:hidden font-serif text-base text-coral mb-1 block">{item.year}</span>
                          <div className="rounded-2xl border p-6 shadow-sm" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                            <h3 className="font-serif text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Left: content */}
                        <div className="pl-10 md:pr-10 md:pl-0 md:text-right">
                          <span className="md:hidden font-serif text-base text-coral mb-1 block">{item.year}</span>
                          <div className="rounded-2xl border p-6 shadow-sm text-left" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                            <h3 className="font-serif text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                          </div>
                        </div>
                        {/* Right: year */}
                        <div className="hidden md:flex pl-10 pt-5">
                          <span className="font-serif text-xl text-coral">{item.year}</span>
                        </div>
                      </>
                    )}
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────────────────── */}
      {/* Card backgrounds are fixed pastel accents by design (not theme-linked), so
          their text stays fixed dark for contrast, matching the fixed card background. */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <span className="text-xs font-medium text-coral uppercase tracking-widest">What We Stand For</span>
            <h2 className="font-serif text-4xl mt-3" style={{ color: 'var(--text-primary)' }}>Our Values</h2>
            <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              These are not posters on a wall. They shape every product decision, every hire, and every line of code we write.
            </p>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <StaggerItem key={v.title}>
                <div className={`${v.bg} border ${v.border} rounded-2xl p-7 h-full transition-transform hover:-translate-y-1`}>
                  <v.Icon className={`w-8 h-8 mb-4 ${v.iconColor}`} />
                  <h3 className="font-serif text-xl text-[#1E293B] mb-3">{v.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── TEAM / HIRING ─────────────────────────────────────────────── */}
      <section className="py-20 bg-nira-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-lavender opacity-[0.05] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <FadeUp>
            <span className="text-xs font-medium text-lavender-dark uppercase tracking-widest">Our Team</span>
            <h2 className="font-serif text-4xl text-white mt-3 mb-4">
              A Small Team with a Big Mission
            </h2>
            <p className="text-slate-400 leading-relaxed mb-8 max-w-xl mx-auto">
              We are a tight-knit team of engineers, designers, and product thinkers from Tanzania and Kenya, obsessed with building technology that actually works for Africa.
            </p>

            {/* Team avatars placeholder */}
            <div className="flex justify-center -space-x-3 mb-8">
              {['E', 'D', 'P', 'K', 'S'].map((initial, i) => (
                <div
                  key={initial}
                  className="w-14 h-14 rounded-full bg-white/10 border-2 border-nira-dark flex items-center justify-center text-sm font-medium text-white hover:scale-110 transition-transform"
                  style={{ zIndex: 5 - i }}
                >
                  {initial}
                </div>
              ))}
              <div
                className="w-14 h-14 rounded-full bg-coral border-2 border-nira-dark flex items-center justify-center text-sm font-medium text-white"
                style={{ zIndex: 0 }}
              >
                You?
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 inline-block text-left max-w-sm">
              <p className="text-white font-medium mb-1">We&apos;re hiring!</p>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Looking for passionate people who want to build technology that changes lives in East Africa.
              </p>
              <Link
                href="/contact"
                className="btn-press inline-flex items-center gap-2 bg-coral hover:bg-coral-dark text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
              >
                Get in touch
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-16 bg-coral text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white opacity-[0.06] translate-x-1/3 -translate-y-1/4" />
        <div className="max-w-xl mx-auto px-6 relative">
          <FadeUp>
            <h2 className="font-serif text-3xl text-white mb-3">
              Ready to join the Nira family?
            </h2>
            <p className="text-white/80 mb-8">
              Free to start. No credit card. Set up in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/#download"
                className="btn-press inline-flex items-center gap-2 bg-white text-coral hover:bg-coral-light font-medium px-7 py-3.5 rounded-full transition-colors shadow-lg"
              >
                Download Free App
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="btn-press inline-flex items-center gap-2 border border-white/40 text-white hover:bg-white/10 font-medium px-7 py-3.5 rounded-full transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
