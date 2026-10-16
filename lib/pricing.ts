/**
 * Nira business pricing — the single place to edit what the website says
 * about fees. Rates are deliberately NOT published yet: when a rate is
 * approved, fill in `amount` (e.g. "TZS 50,000" or "8%") and the pricing
 * page and homepage preview pick it up; until then `label` is shown.
 *
 * Keep in sync with what the backend actually does: commission accrues only
 * on completed, Nira-attributed bookings/orders (commission_service.py),
 * is voided on cancellation/no-show, and can be disputed from the business's
 * monthly statement (Nira Earnings).
 */

export type PricingTier = 'core' | 'optional'
export type PricingIcon = 'rocket' | 'calendar' | 'bag' | 'sparkles' | 'megaphone'

export interface PricingItem {
  id: string
  tier: PricingTier
  icon: PricingIcon
  title: string
  /** How it's charged, in a few words ("One-time fee", "Pay per completed booking") */
  billing: string
  description: string
  /** Shown while `amount` is empty */
  label: string
  /** Approved price or rate — leave null until confirmed */
  amount: string | null
  points: string[]
}

export const ONBOARDING_OPTIONS = [
  {
    id: 'self',
    name: 'Self-service setup',
    label: 'Low-cost setup',
    amount: null as string | null,
    description: 'Set up your profile, services or products and opening hours yourself, with step-by-step guidance in the Nira app.',
    points: ['Guided setup in the app or dashboard', 'Go live when you are ready', 'Help articles and chat support'],
  },
  {
    id: 'assisted',
    name: 'Assisted onboarding',
    label: 'One-time setup fee',
    amount: null as string | null,
    description: 'Our team sets everything up with you, so you are ready to receive customers from day one.',
    points: [
      'Business profile, photos and opening hours',
      'Services or product catalogue with prices',
      'Nira AI assistant configured for your business',
      'Walkthrough for you and your staff',
    ],
  },
]

export const PRICING: PricingItem[] = [
  {
    id: 'onboarding',
    tier: 'core',
    icon: 'rocket',
    title: 'Business onboarding',
    billing: 'One-time fee',
    description: 'Get your business ready for Nira. Do it yourself at low cost, or let our team set you up.',
    label: 'Low-cost self-service · one-time assisted setup',
    amount: null,
    points: ['Choose self-service or assisted', 'Paid once, not every month'],
  },
  {
    id: 'booking',
    tier: 'core',
    icon: 'calendar',
    title: 'Booking commission',
    billing: 'Pay per completed booking',
    description: 'Nira earns a commission when a customer completes an eligible booking made through Nira. No completed booking, no booking commission.',
    label: 'Commission rate to be confirmed',
    amount: null,
    points: ['Only bookings that come through Nira', 'Only once the service is completed', 'Never for messages, cancellations or no-shows'],
  },
  {
    id: 'order',
    tier: 'core',
    icon: 'bag',
    title: 'Product order commission',
    billing: 'Pay per completed order',
    description: 'Sell beauty products through Nira and pay a commission on eligible completed orders that came through the platform.',
    label: 'Commission rate to be confirmed',
    amount: null,
    points: ['Only orders that come through Nira', 'Only once the order is delivered or collected', 'Never for cancelled orders'],
  },
  {
    id: 'featured',
    tier: 'optional',
    icon: 'sparkles',
    title: 'Featured listings & sponsored placements',
    billing: 'Optional promotion',
    description: 'Give your salon, spa, shop or products extra visibility with paid placements. Standard marketplace listing stays free.',
    label: 'Packages and prices to be announced',
    amount: null,
    points: ['Clearly labelled as sponsored', 'Standard discovery never requires it'],
  },
  {
    id: 'campaigns',
    tier: 'optional',
    icon: 'megaphone',
    title: 'Campaign services',
    billing: 'Pay when you need it',
    description: 'Optional help promoting offers, attracting new customers, filling quiet appointment slots and bringing previous customers back.',
    label: 'Custom quote or campaign package',
    amount: null,
    points: ['Fill quiet slots with offers you approve', 'Win back previous customers', 'Priced separately, before you commit'],
  },
]

export const NEVER_CHARGED = [
  'Messages and enquiries from customers',
  'Bookings or orders that are cancelled',
  'No-shows',
  'Customers who come to you directly, not through Nira',
  'A standard listing on the Nira marketplace',
]

export const PRICING_FAQ = [
  {
    q: 'Is there a monthly subscription?',
    a: 'No. There is no mandatory monthly subscription. You pay a one-time onboarding fee (or choose low-cost self-service), then fees only when Nira brings you completed bookings or orders, plus any optional services you choose.',
  },
  {
    q: 'What does onboarding include, and do I have to pay for assisted setup?',
    a: 'Onboarding gets your profile, services or products, opening hours and AI assistant ready. You can do it yourself at low cost, or choose assisted onboarding where our team sets it up with you for a one-time fee.',
  },
  {
    q: 'When exactly is a booking commission charged?',
    a: 'Only when a customer books through Nira (on WhatsApp or the web) and the service is completed. Every Nira booking has a reference like NR-8K2F7Q so you can see exactly which bookings Nira brought you. Cancelled bookings and no-shows are not charged.',
  },
  {
    q: 'How do product order commissions work?',
    a: 'When a customer orders your products through Nira and the order is delivered or collected, a commission applies to that completed order. Cancelled orders are not charged.',
  },
  {
    q: 'Do customer deposits or payments go to Nira?',
    a: 'Customer payments are for your service or product, not Nira fees. Nira’s commission is a separate, clearly itemised amount on your monthly statement.',
  },
  {
    q: 'Do I need to pay to appear in the marketplace?',
    a: 'No. Every active business with marketplace visibility switched on is listed and recommended based on fit, location and reviews. Featured listings and sponsored placements are an optional paid upgrade, always labelled as sponsored.',
  },
  {
    q: 'What are campaign services?',
    a: 'Optional help to promote offers, attract new customers, fill quiet appointment slots and bring past customers back. They are quoted and agreed with you before anything starts.',
  },
  {
    q: 'What if I think a charge is wrong?',
    a: 'Every commission appears on your monthly statement in Nira Earnings with its booking or order reference. You can dispute any line directly from the statement — it is paused while our team reviews it.',
  },
]
