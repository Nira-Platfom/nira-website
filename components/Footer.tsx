import Link from 'next/link'
import { ArrowUp, ArrowUpRight, MessageCircle } from 'lucide-react'
import NiraWordmark from '@/components/NiraWordmark'
import NiraIcon from '@/components/NiraIcon'
import { DASHBOARD_LOGIN_URL, DASHBOARD_REGISTER_URL, WHATSAPP_CHAT_URL } from '@/lib/links'

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: 'For customers',
    links: [
      { label: 'Explore businesses', href: '/explore' },
      { label: 'Ask Nira', href: '/chat' },
      { label: 'Chat on WhatsApp', href: WHATSAPP_CHAT_URL, external: true },
      { label: 'How it works', href: '/#how-it-works' },
    ],
  },
  {
    title: 'For businesses',
    links: [
      { label: 'Pricing', href: '/pricing' },
      { label: 'Get started', href: DASHBOARD_REGISTER_URL },
      { label: 'Sign in', href: DASHBOARD_LOGIN_URL },
      { label: 'Features', href: '/#features' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
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

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-nira-dark text-white">
      {/* brand accent line + soft glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-coral to-lavender" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[720px] -translate-x-1/2 rounded-full bg-coral/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6 pb-8 pt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_2fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2" aria-label="Nira home">
              <NiraIcon size={26} variant="white" />
              <NiraWordmark size="md" variant="white" />
            </Link>
            <p className="mt-5 font-serif text-[22px] leading-snug text-white">
              The beauty world, <span className="text-coral">in one conversation.</span>
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-slate-400">
              Find salons, spas and beauty products across Dar es Salaam — Nira compares, books and orders for you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/chat"
                className="btn-press inline-flex h-11 items-center gap-2 rounded-full bg-coral px-5 text-[14px] font-medium text-white shadow-btn-coral transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle size={16} /> Ask Nira
              </Link>
              <a
                href={WHATSAPP_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 text-[14px] font-medium text-white transition-colors hover:border-[#25D366] hover:bg-[#25D366]/10"
              >
                <WhatsAppIcon /> WhatsApp
              </a>
            </div>
          </div>

          {/* Link columns */}
          <nav className="grid grid-cols-2 gap-10 sm:grid-cols-3" aria-label="Footer">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-[12px] font-medium uppercase tracking-[0.16em] text-slate-500">{col.title}</h4>
                <ul className="mt-5 space-y-3.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <FooterLink {...l} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-5 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-[13px] text-slate-500">© {new Date().getFullYear()} Nira · Made in Tanzania 🇹🇿</p>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/10 px-3 py-1 text-[12px] text-slate-400">Kiswahili · English</span>
            <a
              href="#"
              className="group inline-flex h-9 items-center gap-1.5 rounded-full border border-white/10 px-3 text-[12px] text-slate-400 transition-colors hover:border-coral hover:text-white"
              aria-label="Back to top"
            >
              Back to top <ArrowUp size={13} className="transition-transform group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
