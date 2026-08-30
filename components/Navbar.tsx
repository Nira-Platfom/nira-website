'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import NiraWordmark from '@/components/NiraWordmark'
import NiraIcon from '@/components/NiraIcon'
import { DASHBOARD_LOGIN_URL, DASHBOARD_REGISTER_URL } from '@/lib/links'

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group relative text-sm font-medium py-1" style={{ color: 'var(--text-secondary)' }}>
      <span className="transition-colors group-hover:text-coral">{children}</span>
      <span className="absolute left-0 -bottom-0.5 h-px w-full bg-coral origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </Link>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'var(--bg-surface)' : 'color-mix(in srgb, var(--bg-surface) 95%, transparent)',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        backdropFilter: scrolled ? undefined : 'blur(6px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <NiraIcon size={26} variant="coral" />
          <NiraWordmark size="md" variant="default" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="/#features">Features</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href={DASHBOARD_LOGIN_URL} className="text-sm font-medium hover:text-coral transition-colors" style={{ color: 'var(--text-secondary)' }}>
            Sign in
          </Link>
          <Link
            href={DASHBOARD_REGISTER_URL}
            className="btn-press bg-coral hover:bg-coral-dark text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 flex flex-col gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 transition-transform duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
            style={{ backgroundColor: 'var(--text-primary)' }}
          />
          <span
            className={`block w-5 h-0.5 transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`}
            style={{ backgroundColor: 'var(--text-primary)' }}
          />
          <span
            className={`block w-5 h-0.5 transition-transform duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
            style={{ backgroundColor: 'var(--text-primary)' }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="md:hidden overflow-hidden"
            style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {[
                { href: '/#features', label: 'Features' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
              ].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 + i * 0.04 }}
                >
                  <Link href={item.href} className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }} onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.05 + 4 * 0.04 }}
                className="flex flex-col gap-3"
              >
                <Link
                  href={DASHBOARD_LOGIN_URL}
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href={DASHBOARD_REGISTER_URL}
                  className="btn-press block bg-coral text-white text-sm font-medium px-5 py-3 rounded-full text-center mt-1"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
