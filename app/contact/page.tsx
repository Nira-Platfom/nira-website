'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', businessType: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  const contacts = [
    {
      label: 'Email',
      value: 'asyahhaji18@gmail.com',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
    },
    {
      label: 'WhatsApp',
      value: '+255 772 630 193',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      label: 'Location',
      value: 'Dar es Salaam, Tanzania 🇹🇿',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="font-sans">

      {/* Header */}
      <section className="pt-28 pb-16 text-center" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-2xl mx-auto px-6">
          <span className="text-xs font-medium text-coral uppercase tracking-widest">Contact</span>
          <h1 className="font-serif text-5xl mt-3 mb-4" style={{ color: 'var(--text-primary)' }}>
            Get in Touch
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Have a question about Nira? Want a demo for your business? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="pb-24" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Left — info */}
            <div className="lg:col-span-2 space-y-6">
              {contacts.map((c) => (
                <div
                  key={c.label}
                  className="flex items-start gap-4 rounded-2xl p-5 border"
                  style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                >
                  <div className="w-10 h-10 rounded-xl bg-coral-light flex items-center justify-center text-coral flex-shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                      {c.label}
                    </p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{c.value}</p>
                  </div>
                </div>
              ))}

              {/* Response time */}
              <div className="bg-mint-light border border-mint/30 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-mint-dark" />
                  <p className="text-sm font-medium text-mint-dark">Quick response</p>
                </div>
                <p className="text-sm text-slate-600">
                  We typically respond within an hours during business hours (Mon–Sat, 8 AM – 6 PM EAT).
                </p>
              </div>

              {/* Languages */}
              <div
                className="rounded-2xl p-5 border"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
              >
                <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
                  We speak
                </p>
                <div className="flex gap-2">
                  <span
                    className="text-sm font-medium px-3 py-1.5 rounded-full border"
                    style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                  >
                    🇹🇿 Swahili
                  </span>
                  <span
                    className="text-sm font-medium px-3 py-1.5 rounded-full border"
                    style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                  >
                    🇬🇧 English
                  </span>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-3">
              <div
                className="rounded-2xl p-8 border"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
              >
                {submitted ? (
                  <div className="py-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-mint-light flex items-center justify-center mx-auto mb-5">
                      <svg className="w-8 h-8 text-mint-dark" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>Message Sent!</h3>
                    <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                      Thank you for reaching out. We&apos;ll get back to you within 2 hours.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', businessType: '', message: '' }) }}
                      className="text-coral hover:underline text-sm font-medium"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-serif text-2xl mb-6" style={{ color: 'var(--text-primary)' }}>Send us a message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="Fatuma Hassan"
                            className="w-full h-12 px-4 rounded-xl border text-sm focus:outline-none focus:border-coral transition-colors"
                            style={{
                              backgroundColor: 'var(--bg-page)',
                              borderColor: 'var(--border)',
                              color: 'var(--text-primary)',
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                            Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="fatuma@salon.co.tz"
                            className="w-full h-12 px-4 rounded-xl border text-sm focus:outline-none focus:border-coral transition-colors"
                            style={{
                              backgroundColor: 'var(--bg-page)',
                              borderColor: 'var(--border)',
                              color: 'var(--text-primary)',
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                            WhatsApp Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+255 700 000 000"
                            className="w-full h-12 px-4 rounded-xl border text-sm focus:outline-none focus:border-coral transition-colors"
                            style={{
                              backgroundColor: 'var(--bg-page)',
                              borderColor: 'var(--border)',
                              color: 'var(--text-primary)',
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                            Business Type
                          </label>
                          <select
                            name="businessType"
                            value={form.businessType}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-xl border text-sm focus:outline-none focus:border-coral transition-colors appearance-none"
                            style={{
                              backgroundColor: 'var(--bg-page)',
                              borderColor: 'var(--border)',
                              color: 'var(--text-primary)',
                            }}
                          >
                            <option value="">Select type...</option>
                            <option value="salon_spa">Salon / Spa</option>
                            <option value="cosmetic_shop">Cosmetic Shop</option>
                            <option value="hair_studio">Hair Studio</option>
                            <option value="nail_bar">Nail Bar</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                          Message *
                        </label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          placeholder="Tell us about your business and how we can help..."
                          className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-coral transition-colors resize-none"
                          style={{
                            backgroundColor: 'var(--bg-page)',
                            borderColor: 'var(--border)',
                            color: 'var(--text-primary)',
                          }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-coral hover:bg-coral-dark disabled:opacity-70 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="py-14 text-center" style={{ backgroundColor: 'var(--bg-dark)' }}>
        <div className="max-w-xl mx-auto px-6">
          <p className="text-white font-serif text-2xl mb-3">Ready to try Nira?</p>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Download free and set up your business in minutes.</p>
          <Link
            href="/#download"
            className="inline-flex items-center gap-2 bg-coral hover:bg-coral-dark text-white font-medium px-7 py-3 rounded-full transition-colors"
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
