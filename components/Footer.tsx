import Link from 'next/link'
import { ArrowUp, ArrowUpRight, Mail, MessageCircle, Phone } from 'lucide-react'
import NiraWordmark from '@/components/NiraWordmark'
import NiraIcon from '@/components/NiraIcon'
import { DASHBOARD_LOGIN_URL, DASHBOARD_REGISTER_URL, WHATSAPP_CHAT_URL } from '@/lib/links'

const SUPPORT_EMAIL = 'asyahhaji18@gmail.com'
const SUPPORT_PHONE = '+255 772 630 193'
const SUPPORT_WA = 'https://wa.me/255772630193'

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Find businesses', href: '/explore' },
      { label: 'Ask Nira', href: '/chat' },
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'WhatsApp', href: WHATSAPP_CHAT_URL, external: true },
    ],
  },
  {
    title: 'For businesses',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Get started', href: DASHBOARD_REGISTER_URL },
      { label: 'Sign in', href: DASHBOARD_LOGIN_URL },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Nira', href: '/about' },
      { label: 'Contact us', href: '/contact' },
    ],
  },
]

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

/** Link with a coral underline that grows in on hover. */
function FooterLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  const cls = 'group inline-flex items-center gap-1 text-[14px] text-slate-400 transition-colors hover:text-white'
  const body = (
    <>
      <span className="relative">
        {label}
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-coral transition-all duration-300 group-hover:w-full" />
      </span>
      {external && <ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" />}
    </>
  )
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a>
  ) : (
    <Link href={href} className={cls}>{body}</Link>
  )
}

function IconButton({ href, label, children, external }: { href: string; label: string; children: React.ReactNode; external?: boolean }) {
  const cls =
    'inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition-all hover:-translate-y-0.5 hover:border-coral/60 hover:bg-white/5 hover:text-white'
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className={cls}>{children}</a>
  ) : (
    <Link href={href} aria-label={label} title={label} className={cls}>{children}</Link>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative overflow-hidden bg-nira-dark text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-coral/70 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Main */}
        <div className="grid grid-cols-1 gap-12 pb-12 pt-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2" aria-label="Nira home">
              <NiraIcon size={26} variant="white" />
              <NiraWordmark size="md" variant="white" />
            </Link>
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-slate-400">
              The AI beauty companion for East Africa. Find salons, spas and beauty products, and book or order in one
              conversation. Built in Dar es Salaam.
            </p>
            <div className="mt-6 flex gap-2.5">
              <IconButton href="/chat" label="Ask Nira"><MessageCircle size={17} /></IconButton>
              <IconButton href={WHATSAPP_CHAT_URL} label="Nira on WhatsApp" external><WhatsAppIcon size={16} /></IconButton>
              <IconButton href={`mailto:${SUPPORT_EMAIL}`} label="Email us" external><Mail size={17} /></IconButton>
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-[1fr_1fr_0.8fr_1.5fr] lg:col-span-8" aria-label="Footer">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-[15px] font-medium text-white">{col.title}</h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <FooterLink {...l} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-[15px] font-medium text-white">Talk to a human</h3>
              <p className="mt-4 text-[13px] leading-relaxed text-slate-500">Questions about Nira or setting up your business? Reach our team.</p>
              <ul className="mt-3 space-y-2.5">
                <li>
                  <a href={SUPPORT_WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[14px] text-slate-300 transition-colors hover:text-white">
                    <Phone size={14} className="text-coral" /> {SUPPORT_PHONE}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex items-center gap-2 text-[14px] text-slate-300 transition-colors hover:text-white">
                    <Mail size={14} className="shrink-0 text-coral" /> {SUPPORT_EMAIL}
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-[13px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Nira. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-white">Terms of Service</Link>
            <span className="hidden text-slate-700 sm:inline">·</span>
            <span>Made in Dar es Salaam 🇹🇿</span>
            <a href="#" aria-label="Back to top" className="group inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition-colors hover:border-coral hover:text-white">
              <ArrowUp size={14} className="transition-transform group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
