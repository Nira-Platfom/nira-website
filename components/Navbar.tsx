'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-sm' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Nira"
            width={90}
            height={36}
            priority
            style={{ objectFit: 'contain' }}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#features"
            className="text-sm font-medium text-slate-500 hover:text-nira-dark transition-colors"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-slate-500 hover:text-nira-dark transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-slate-500 hover:text-nira-dark transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-slate-500 hover:text-nira-dark transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/contact"
            className="text-sm font-medium text-slate-500 hover:text-nira-dark transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/#download"
            className="bg-coral hover:bg-coral-dark text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
          >
            Download App
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 flex flex-col gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-nira-dark transition-transform duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`block w-5 h-0.5 bg-nira-dark transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block w-5 h-0.5 bg-nira-dark transition-transform duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-nira-border px-6 py-5 flex flex-col gap-4">
          <Link href="/#features" className="text-sm font-medium text-slate-500" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="/pricing"   className="text-sm font-medium text-slate-500" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="/about"     className="text-sm font-medium text-slate-500" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact"   className="text-sm font-medium text-slate-500" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link
            href="/#download"
            className="bg-coral text-white text-sm font-medium px-5 py-3 rounded-full text-center mt-2"
            onClick={() => setMenuOpen(false)}
          >
            Download App
          </Link>
        </div>
      )}
    </header>
  )
}
