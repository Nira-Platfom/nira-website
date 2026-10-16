import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight, BadgeCheck, CalendarCheck, Check, CircleCheck, Flag, Megaphone, Receipt, Rocket,
  ShoppingBag, Sparkles, Store, X,
} from 'lucide-react'
import { DASHBOARD_REGISTER_URL } from '@/lib/links'
import { NEVER_CHARGED, PRICING, type PricingIcon, type PricingItem } from '@/lib/pricing'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/animations'
import OnboardingChooser from '@/components/pricing/OnboardingChooser'
import PricingFaq from '@/components/pricing/PricingFaq'

export const metadata: Metadata = {
  title: 'Pricing for businesses · Nira',
  description:
    'No mandatory monthly subscription. A one-time onboarding, commission only on completed bookings and orders that come through Nira, and optional promotion and campaign services.',
}

const ICONS: Record<PricingIcon, typeof Rocket> = {
  rocket: Rocket,
  calendar: CalendarCheck,
  bag: ShoppingBag,
  sparkles: Sparkles,
  megaphone: Megaphone,
}

// Brand accent per card — coral / lavender / mint, as in the design system.
const ACCENTS: Record<string, { tile: string; ring: string }> = {
  onboarding: { tile: 'bg-coral-light text-coral-deep', ring: 'group-hover:border-coral/60' },
  booking: { tile: 'bg-lavender-light text-lavender-deep', ring: 'group-hover:border-lavender' },
  order: { tile: 'bg-mint-light text-mint-deep', ring: 'group-hover:border-mint' },
  featured: { tile: 'bg-amber-light text-amber-deep', ring: 'group-hover:border-amber' },
  campaigns: { tile: 'bg-coral-light text-coral-deep', ring: 'group-hover:border-coral/60' },
}

const STEPS = [
  { icon: Rocket, title: 'Join once', text: 'Low-cost self-service or assisted onboarding.' },
  { icon: Store, title: 'Get listed free', text: 'Customers discover you on WhatsApp and the web.' },
  { icon: CircleCheck, title: 'Pay when it’s real', text: 'Commission only on completed bookings and orders.' },
  { icon: Sparkles, title: 'Grow if you want', text: 'Optional featured placement and campaigns.' },
]

const LIFECYCLE = [
  { icon: CalendarCheck, title: 'Booked through Nira', text: 'Gets a reference like NR-8K2F7Q, marked “via Nira” in your app.' },
  { icon: Check, title: 'Service completed', text: 'Commission applies only once the visit or delivery is done.' },
  { icon: Receipt, title: 'On your monthly statement', text: 'Every fee listed with its reference in Nira Earnings.' },
  { icon: Flag, title: 'Dispute any line', text: 'Something wrong? Flag it — it’s paused while we review.' },
]

const surface = { backgroundColor: 'var(--bg-surface)' }
const page = { backgroundColor: 'var(--bg-page)' }
const card = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }
const text1 = { color: 'var(--text-primary)' }
const text2 = { color: 'var(--text-secondary)' }
const text3 = { color: 'var(--text-muted)' }

function Price({ item }: { item: PricingItem }) {
  return (
    <p className="font-serif text-[22px] leading-tight" style={text1}>
      {item.amount ?? item.label}
    </p>
  )
}

function PriceCard({ item, children }: { item: PricingItem; children?: React.ReactNode }) {
  const Icon = ICONS[item.icon]
  const accent = ACCENTS[item.id]
  return (
    <div
      className={`group relative flex h-full flex-col rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(15,23,42,0.35)] ${accent.ring}`}
      style={card}
    >
      <div className="flex items-center justify-between">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${accent.tile}`}>
          <Icon size={22} />
        </span>
        <span className="rounded-full border px-3 py-1 text-[12px] font-medium" style={{ ...text2, borderColor: 'var(--border)' }}>
          {item.billing}
        </span>
      </div>
      <h3 className="mt-6 text-[19px] font-medium" style={text1}>{item.title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed" style={text2}>{item.description}</p>
      <div className="mt-auto pt-6">
        {children ?? (
          <>
            <div className="border-t pt-5" style={{ borderColor: 'var(--border)' }}>
              <Price item={item} />
            </div>
            <ul className="mt-4 space-y-2">
              {item.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[14px]" style={text2}>
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint-light text-mint-deep">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

export default function PricingPage() {
  const core = PRICING.filter((p) => p.tier === 'core')
  const optional = PRICING.filter((p) => p.tier === 'optional')
  const onboarding = core.find((p) => p.id === 'onboarding')!

  return (
    <div className="font-sans">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-16 pt-32 nira-section-light" style={surface}>
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-coral opacity-[0.07] blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <FadeUp>
            <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-coral">Nira for business</span>
            <h1 className="mt-4 font-serif text-[38px] leading-[1.08] sm:text-[48px] lg:text-[56px]" style={text1}>
              <span className="sm:whitespace-nowrap">Your business. More customers.</span>
              <br />
              <span className="text-coral">No monthly pressure.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed" style={text2}>
              Start affordably, reach new customers, and pay fees when Nira helps your business generate real results.
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-mint-light px-4 py-2 text-[14px] font-medium text-mint-deep">
              <BadgeCheck size={16} /> No mandatory monthly subscription
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={DASHBOARD_REGISTER_URL}
                className="btn-shimmer btn-press group inline-flex h-12 items-center gap-2 rounded-full px-7 text-[15px] font-medium text-white shadow-lg shadow-coral/30"
              >
                Get started with Nira
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/contact"
                className="btn-press inline-flex h-12 items-center rounded-full border px-7 text-[15px] font-medium transition-colors hover:border-coral hover:text-coral"
                style={{ ...text2, borderColor: 'var(--border)' }}
              >
                Talk to us about setup
              </Link>
            </div>
          </FadeUp>
        </div>

        {/* How it works, at a glance */}
        <div className="relative mx-auto mt-16 max-w-5xl px-6">
          <StaggerContainer className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <StaggerItem key={s.title}>
                <div className="group relative h-full rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-coral/50" style={card}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral-light text-coral-deep">
                      <s.icon size={18} />
                    </span>
                    <span className="text-[12px] font-medium" style={text3}>0{i + 1}</span>
                  </div>
                  <p className="mt-4 text-[15px] font-medium" style={text1}>{s.title}</p>
                  <p className="mt-1 text-[13px] leading-snug" style={text2}>{s.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Core pricing ──────────────────────────────────────────────── */}
      <section className="py-20" style={page}>
        <div className="mx-auto max-w-6xl px-6">
          <FadeUp className="mx-auto max-w-2xl text-center">
            <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-coral">Simple pricing</span>
            <h2 className="mt-3 font-serif text-[34px] leading-tight sm:text-[42px]" style={text1}>Built for growth</h2>
            <p className="mt-3 text-[16px]" style={text2}>
              Three core fees, each tied to something real. Optional services are charged separately — only if you choose them.
            </p>
          </FadeUp>

          <StaggerContainer className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <StaggerItem>
              <PriceCard item={onboarding}>
                <div className="border-t pt-5" style={{ borderColor: 'var(--border)' }}>
                  <OnboardingChooser />
                </div>
              </PriceCard>
            </StaggerItem>
            {core.filter((p) => p.id !== 'onboarding').map((item) => (
              <StaggerItem key={item.id}>
                <PriceCard item={item} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeUp className="mt-16 flex items-center gap-4">
            <span className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
            <span className="text-[12px] font-medium uppercase tracking-[0.2em]" style={text3}>Optional — only if you want them</span>
            <span className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
          </FadeUp>

          <StaggerContainer className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {optional.map((item) => (
              <StaggerItem key={item.id}>
                <PriceCard item={item} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Commission only when it's real ────────────────────────────── */}
      <section className="py-20" style={surface}>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div>
            <FadeUp>
              <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-coral">Transparent commission</span>
              <h2 className="mt-3 font-serif text-[32px] leading-tight sm:text-[38px]" style={text1}>
                You pay commission only when it’s real
              </h2>
              <p className="mt-3 max-w-lg text-[16px]" style={text2}>
                Every booking and order Nira brings you is tracked from start to finish, so you always know what you’re paying for.
              </p>
            </FadeUp>
            <StaggerContainer className="relative mt-8 space-y-0">
              {LIFECYCLE.map((step, i) => (
                <StaggerItem key={step.title}>
                  <div className={`relative flex gap-4 ${i < LIFECYCLE.length - 1 ? 'pb-9' : ''}`}>
                    {i < LIFECYCLE.length - 1 && (
                      <span className="absolute left-5 top-10 h-[calc(100%-2.5rem)] w-0.5 rounded-full bg-gradient-to-b from-coral/60 to-coral/10" aria-hidden="true" />
                    )}
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral text-white shadow-btn-coral">
                      <step.icon size={18} />
                    </span>
                    <div className="pt-1.5">
                      <p className="text-[16px] font-medium" style={text1}>{step.title}</p>
                      <p className="mt-0.5 text-[14px]" style={text2}>{step.text}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          <FadeUp delay={0.15}>
            <div className="h-full rounded-3xl border p-7" style={card}>
              <p className="text-[18px] font-medium" style={text1}>You’re never charged for</p>
              <ul className="mt-5 space-y-3.5">
                {NEVER_CHARGED.map((n) => (
                  <li key={n} className="flex items-start gap-3 text-[15px]" style={text2}>
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-muted)' }}>
                      <X size={13} strokeWidth={3} />
                    </span>
                    {n}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-2xl p-4 text-[13px] leading-relaxed" style={{ ...text2, backgroundColor: 'var(--bg-page)' }}>
                Customer payments and deposits are for your service or product — they are not Nira revenue. Nira’s commission is a separate,
                itemised amount on your statement.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Free listing vs featured ──────────────────────────────────── */}
      <section className="py-20" style={page}>
        <div className="mx-auto max-w-5xl px-6">
          <FadeUp className="mx-auto max-w-2xl text-center">
            <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-coral">Visibility</span>
            <h2 className="mt-3 font-serif text-[32px] leading-tight sm:text-[38px]" style={text1}>Being found is free. Standing out is optional.</h2>
          </FadeUp>
          <StaggerContainer className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            <StaggerItem>
              <div className="h-full rounded-3xl border p-7" style={card}>
                <div className="flex items-center justify-between">
                  <p className="text-[18px] font-medium" style={text1}>Standard listing</p>
                  <span className="rounded-full bg-mint-light px-3 py-1 text-[12px] font-medium text-mint-deep">Free</span>
                </div>
                <ul className="mt-5 space-y-3">
                  {[
                    'Listed in the Nira marketplace and explore page',
                    'Recommended by Nira based on fit, location and reviews',
                    'Bookable and orderable on WhatsApp and the web',
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-[15px]" style={text2}>
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint-light text-mint-deep"><Check size={12} strokeWidth={3} /></span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="relative h-full overflow-hidden rounded-3xl border p-7" style={{ ...card, borderColor: 'rgba(255,107,107,0.4)' }}>
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-coral opacity-10 blur-2xl" aria-hidden="true" />
                <div className="relative flex items-center justify-between">
                  <p className="text-[18px] font-medium" style={text1}>Featured & sponsored</p>
                  <span className="rounded-full bg-coral-light px-3 py-1 text-[12px] font-medium text-coral-deep">Optional</span>
                </div>
                <ul className="relative mt-5 space-y-3">
                  {[
                    'Extra visibility for your business or products',
                    'Always clearly labelled as sponsored',
                    'Packages and prices to be announced',
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-[15px]" style={text2}>
                      <Sparkles size={17} className="mt-0.5 shrink-0 text-coral" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="py-20" style={surface}>
        <div className="mx-auto max-w-3xl px-6">
          <FadeUp className="mb-10 text-center">
            <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-coral">FAQ</span>
            <h2 className="mt-3 font-serif text-[32px] sm:text-[38px]" style={text1}>Questions about pricing</h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <PricingFaq />
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="px-6 py-20" style={page}>
        <FadeUp>
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[32px] bg-coral px-8 py-14 text-center shadow-[0_30px_60px_-20px_rgba(255,107,107,0.5)]">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/15 blur-2xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-lavender/40 blur-3xl" aria-hidden="true" />
            <h2 className="relative font-serif text-[32px] leading-tight text-white sm:text-[40px]">Ready to grow with Nira?</h2>
            <p className="relative mx-auto mt-3 max-w-md text-[16px] text-white/85">
              Tell us about your business and we’ll help you choose the right setup.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link href={DASHBOARD_REGISTER_URL}
                className="btn-press group inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-[15px] font-medium text-coral transition-colors hover:bg-coral-light">
                Get started with Nira <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/contact"
                className="btn-press inline-flex h-12 items-center rounded-full border border-white/50 px-7 text-[15px] font-medium text-white transition-colors hover:bg-white/10">
                Contact us
              </Link>
            </div>
            <p className="relative mt-6 text-[13px] text-white/75">
              No mandatory monthly subscription. Optional services and applicable fees are explained before purchase.
            </p>
          </div>
        </FadeUp>
      </section>
    </div>
  )
}
