import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pricing — Nira',
  description: 'Simple, transparent pricing for beauty businesses. Start free, upgrade when you\'re ready.',
}

const plans = [
  {
    name: 'Free ',
    price: 'TZS 0',
    period: '/month',
    desc: 'Perfect for getting started. No credit card needed.',
    highlight: false,
    features: [
      { text: 'unlimited  WhatsApp messages/month', included: true },
      { text: 'mutliple  team member', included: true },
      { text: 'Auto-reply & basic bot flows', included: true },
      { text: 'Bookings management', included: true },
      { text: 'Product & order management', included: true },
      { text: 'Customer profiles', included: true },
      { text: 'AI skincare advice', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Broadcast campaigns', included: true },
      { text: 'Priority support', included: true},
    ],
    cta: 'Get started free',
    ctaStyle: 'bg-coral hover:bg-coral-dark text-white',
  },
  {
    name: 'Pro',
    price: 'TZS 35,000',
    period: '/month',
    desc: 'Everything you need to grow your beauty business.',
    highlight: true,
    badge: 'Most Popular',
    features: [
      { text: 'Unlimited WhatsApp messages', included: true },
      { text: 'multiple team members', included: true },
      { text: 'Auto-reply & basic bot flows', included: true },
      { text: 'Bookings management', included: true },
      { text: 'Product & order management', included: true },
      { text: 'Customer profiles', included: true },
      { text: 'AI skincare advice', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Broadcast campaigns', included: true },
      { text: 'Priority support', included: true },
    ],
    cta: 'Start 30-day free trial',
    ctaStyle: 'bg-white hover:bg-coral-light text-coral',
  },
  {
    name: 'Business',
    price: 'TZS 350,000',
    period: '/year',
    desc: 'For established businesses that need more power. TZS 29,167/month — save TZS 70,000 vs monthly.',
    highlight: false,
    features: [
      { text: 'Unlimited WhatsApp messages', included: true },
      { text: 'Up to 10 team members', included: true },
      { text: 'Auto-reply & basic bot flows', included: true },
      { text: 'Bookings management', included: true },
      { text: 'Product & order management', included: true },
      { text: 'Customer profiles', included: true },
      { text: 'AI skincare advice', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Broadcast campaigns', included: true },
      { text: 'Custom bot flows', included: true },
      { text: 'Priority support', included: true },
    ],
    cta: 'Start 30-day free trial',
    ctaStyle: 'bg-coral hover:bg-coral-dark text-white',
  },
]

const faqs = [
  {
    q: 'Do I need a credit card to start?',
    a: 'No. You can sign up and use Nira for free without a credit card. Upgrade to Pro or Business when you\'re ready.',
  },
  {
    q: 'What happens after the free trial?',
    a: 'After your 30-day trial ends, you\'ll be moved to the Free plan unless you choose to upgrade. You won\'t lose your data.',
  },
  {
    q: 'Can I use Nira with my existing WhatsApp number?',
    a: 'Yes! Nira works with any WhatsApp Business number. You just need to connect it through the Meta Business Suite — we guide you step by step.',
  },
  {
    q: 'Does Nira support both Swahili and English?',
    a: 'Yes. Your customers choose their preferred language when they first message your business. Nira then responds in that language throughout the conversation.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. There are no long-term contracts. You can cancel or downgrade at any time from your account settings.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept M-Pesa, Airtel Money, Tigopesa, and all major credit/debit cards — all common payment methods in East Africa.',
  },
]

function CheckIcon({ included }: { included: boolean }) {
  if (included) {
    return (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    )
  }
  return (
    <svg className="w-4 h-4 flex-shrink-0 opacity-30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default function PricingPage() {
  return (
    <div className="font-sans">

      {/* Header */}
      <section className="pt-28 pb-16 text-center" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs font-medium text-coral uppercase tracking-widest">Pricing</span>
          <h1 className="font-serif text-5xl mt-3 mb-4" style={{ color: 'var(--text-primary)' }}>
            Pick your power level
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Start for free. Upgrade when your business is ready to grow.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-mint-light text-mint-dark text-sm font-medium px-4 py-2 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            30-day free trial for one month — no credit card required
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-24" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${plan.highlight ? 'bg-coral text-white shadow-2xl shadow-coral/25 md:-mt-4 md:mb-4' : 'border'}`}
                style={plan.highlight ? {} : {
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border)',
                }}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1E293B] text-white text-[11px] font-medium px-3 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h2
                    className="font-medium text-sm mb-2"
                    style={plan.highlight ? { color: 'rgba(255,255,255,0.7)' } : { color: 'var(--text-muted)' }}
                  >
                    {plan.name}
                  </h2>
                  <div className="flex items-end gap-1 mb-2">
                    <span
                      className="font-serif text-3xl"
                      style={plan.highlight ? { color: 'white' } : { color: 'var(--text-primary)' }}
                    >
                      {plan.price}
                    </span>
                    <span
                      className="text-sm mb-1"
                      style={plan.highlight ? { color: 'rgba(255,255,255,0.7)' } : { color: 'var(--text-muted)' }}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    className="text-sm"
                    style={plan.highlight ? { color: 'rgba(255,255,255,0.8)' } : { color: 'var(--text-secondary)' }}
                  >
                    {plan.desc}
                  </p>
                </div>

                <Link
                  href="/#download"
                  className={`block text-center py-3 rounded-xl font-medium text-sm transition-colors mb-7 ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f.text}
                      className="flex items-center gap-3 text-sm"
                      style={plan.highlight
                        ? { color: f.included ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)' }
                        : { color: f.included ? 'var(--text-secondary)' : 'var(--text-muted)', opacity: f.included ? 1 : 0.45 }
                      }
                    >
                      <span style={plan.highlight
                        ? { color: f.included ? 'white' : 'rgba(255,255,255,0.3)' }
                        : { color: f.included ? 'var(--mint)' : 'var(--text-muted)' }
                      }>
                        <CheckIcon included={f.included} />
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment methods */}
      <section className="py-12 border-y" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm font-medium mb-5 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Accepted payment methods
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['M-Pesa', 'Airtel Money', 'Tigo Pesa', 'Visa', 'Mastercard'].map((method) => (
              <div
                key={method}
                className="px-5 py-2.5 rounded-xl text-sm font-medium border"
                style={{
                  backgroundColor: 'var(--bg-page)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                {method}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-medium text-coral uppercase tracking-widest">FAQ</span>
            <h2 className="font-serif text-4xl mt-3" style={{ color: 'var(--text-primary)' }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl p-6 border"
                style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border)' }}
              >
                <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>{faq.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-coral text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-serif text-3xl text-white mb-3">Ready to get started?</h2>
          <p className="text-white/80 mb-8">Download the app and set up your business in minutes.</p>
          <Link
            href="/#download"
            className="inline-flex items-center gap-2 bg-white text-coral hover:bg-coral-light font-medium px-8 py-3.5 rounded-full transition-colors"
          >
            Download Free App
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

    </div>
  )
}
