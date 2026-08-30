import Link from 'next/link'
import NiraWordmark from '@/components/NiraWordmark'
import NiraIcon from '@/components/NiraIcon'
import { DASHBOARD_REGISTER_URL, WHATSAPP_CHAT_URL } from '@/lib/links'

export default function Footer() {
  return (
    <footer className="bg-nira-dark text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <NiraIcon size={26} variant="white" />
              <NiraWordmark size="md" variant="white" />
            </Link>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Your Beauty AI Companion. Glow Smarter.
            </p>
            <p className="mt-4 text-xs text-slate-500">
              AI-powered business management for beauty businesses in East Africa.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-medium text-white mb-4 tracking-wide">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#features" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href={DASHBOARD_REGISTER_URL} className="text-sm text-slate-400 hover:text-white transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Business links */}
          <div>
            <h4 className="text-sm font-medium text-white mb-4 tracking-wide">Business</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-sm text-slate-400">Salons &amp; Spas</span>
              </li>
              <li>
                <span className="text-sm text-slate-400">Cosmetic Shops</span>
              </li>
              <li>
                <span className="text-sm text-slate-400">Hair Studios</span>
              </li>
              <li>
                <span className="text-sm text-slate-400">Nail Bars</span>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-medium text-white mb-4 tracking-wide">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-white mb-3 tracking-wide">Talk to Us</h4>
              <div className="flex gap-3">
                {/* WhatsApp — real number, everything else here stays a placeholder until it's real */}
                <a
                  href={WHATSAPP_CHAT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-press w-8 h-8 rounded-full bg-white/10 hover:bg-coral hover:scale-110 transition-all flex items-center justify-center"
                  aria-label="Chat with Nira on WhatsApp"
                >
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Nira. All rights reserved.
          </p>
          <p className="text-sm text-slate-500">
            Made in Tanzania
          </p>
        </div>
      </div>

      {/* Closing brand moment */}
      <div className="max-w-6xl mx-auto px-6 pb-6 md:pb-2 overflow-hidden">
        <NiraWordmark size="xl" variant="white" className="w-full justify-center opacity-90" />
      </div>
    </footer>
  )
}
