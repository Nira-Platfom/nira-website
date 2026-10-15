'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, MessageCircle, Search, SlidersHorizontal, Star, X } from 'lucide-react'
import { WHATSAPP_CHAT_URL } from '@/lib/links'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nira-backend-w7p9.onrender.com'

const cardStyle = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }
const primaryText = { color: 'var(--text-primary)' }
const mutedText = { color: 'var(--text-muted)' }
const borderOnly = { borderColor: 'var(--border)' }

// ── Backend contract (app/routes/agent.py /explore) ──────────────────────────
type BusinessHit = {
  business_id: string
  name: string
  type: 'salon_spa' | 'cosmetic_shop'
  area: string | null
  avg_rating: number
  total_reviews: number
  is_verified: boolean
  description: string | null
  price_from: number | null
  price_to: number | null
  services_count: number
  products_count: number
  matching?: { kind: string; name: string; price: number | null }[]
  bot_code: string | null
  image_url?: string | null
  distance_km?: number
}
type ServiceHit = {
  service_id: string; service: string; price: number; duration_minutes: number
  business_id: string; business: string; area: string | null; avg_rating: number; total_reviews: number; image_url?: string | null
  bot_code?: string | null
}
type ProductHit = {
  product_id: string; name: string; brand: string | null; price: number; business_id: string; business: string
  area: string | null; avg_rating: number; image_url?: string | null; stock_left?: number; bot_code?: string | null
}
type ExploreResult = { businesses: BusinessHit[]; services: ServiceHit[]; products: ProductHit[] }
type BusinessDetail = {
  business_id: string; name: string; type: string; description: string | null; area: string | null; address: string | null
  avg_rating: number; total_reviews: number; opening_hours: string[]; bot_code: string | null; image_url?: string | null
  services?: { service_id: string; name: string; price: number; duration_minutes: number }[]
  products?: { product_id: string; name: string; price: number; category: string | null }[]
  recent_reviews: { rating: number; comment: string }[]
  active_offers: { title: string; discount: string }[]
}

const fmt = (n: number) => `TZS ${Math.round(n).toLocaleString('en-US')}`
const TYPES = [
  { value: '', label: 'All' },
  { value: 'salon_spa', label: 'Salons & spas' },
  { value: 'cosmetic_shop', label: 'Beauty shops' },
]
const RATINGS = [
  { value: '', label: 'Any rating' },
  { value: '3.5', label: '3.5★ & up' },
  { value: '4', label: '4★ & up' },
  { value: '4.5', label: '4.5★ & up' },
]
const SORTS = [
  { value: 'relevance', label: 'Best match' },
  { value: 'rating', label: 'Top rated' },
  { value: 'reviews', label: 'Most reviewed' },
  { value: 'price_low', label: 'Price: low to high' },
  { value: 'price_high', label: 'Price: high to low' },
]

function chatHref(code: string | null | undefined, message: string) {
  const q = `?q=${encodeURIComponent(message)}`
  return code ? `/chat/${encodeURIComponent(code)}${q}` : `/chat${q}`
}

function Rating({ value, count }: { value: number; count?: number }) {
  if (!value) return <span className="text-[12px]" style={mutedText}>New</span>
  return (
    <span className="inline-flex items-center gap-1 text-[12px]" style={mutedText}>
      <Star size={12} className="fill-amber-400 text-amber-400" /> {value.toFixed(1)}
      {count != null && <span>({count})</span>}
    </span>
  )
}

function Thumb({ url, emoji }: { url?: string | null; emoji: string }) {
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" className="h-36 w-full object-cover" loading="lazy" />
  ) : (
    <div className="flex h-36 w-full items-center justify-center bg-lavender-light text-4xl">{emoji}</div>
  )
}

export default function ExploreMarketplace({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [submitted, setSubmitted] = useState(initialQuery)
  const [type, setType] = useState('')
  const [area, setArea] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRating, setMinRating] = useState('')
  const [sort, setSort] = useState('relevance')
  const [areas, setAreas] = useState<{ area: string; count: number }[]>([])
  const [data, setData] = useState<ExploreResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detail, setDetail] = useState<BusinessDetail | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/agent/explore/areas`).then((r) => r.json()).then((d) => setAreas(d.areas || [])).catch(() => {})
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({ sort, limit: '24' })
    if (submitted) params.set('q', submitted)
    if (type) params.set('business_type', type)
    if (area) params.set('area', area)
    if (maxPrice) params.set('max_price', maxPrice)
    if (minRating) params.set('min_rating', minRating)
    try {
      const res = await fetch(`${API_URL}/agent/explore?${params}`)
      if (!res.ok) throw new Error()
      setData(await res.json())
    } catch {
      setError('Could not load the marketplace — please try again.')
    } finally {
      setLoading(false)
    }
  }, [submitted, type, area, maxPrice, minRating, sort])

  useEffect(() => {
    load()
  }, [load])

  const openDetail = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/agent/explore/business/${id}`)
      if (res.ok) setDetail(await res.json())
    } catch {
      /* ignore */
    }
  }

  const empty = data && !data.businesses.length && !data.services.length && !data.products.length
  const selectCls = 'h-11 rounded-xl border px-3 text-[14px] outline-none focus:border-coral'

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
      <div className="pt-8 pb-6">
        <h1 className="font-serif text-[34px] sm:text-[44px] leading-tight" style={primaryText}>
          Explore beauty in Dar es Salaam
        </h1>
        <p className="mt-2 text-[15px] max-w-2xl" style={mutedText}>
          Every salon, spa and beauty shop on Nira — search by name, area, service or product, then let Nira book or order for you.
        </p>
      </div>

      {/* Search + filters */}
      <form
        onSubmit={(e) => { e.preventDefault(); setSubmitted(query.trim()) }}
        className="sticky top-16 z-20 -mx-4 sm:mx-0 px-4 sm:px-0 py-3"
        style={{ backgroundColor: 'var(--bg-page)' }}
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={mutedText} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Salon name, braids, facial, sunscreen…"
              className="h-12 w-full rounded-full border pl-11 pr-4 text-[15px] outline-none focus:border-coral"
              style={{ ...cardStyle, ...primaryText }}
              aria-label="Search the marketplace"
            />
          </div>
          <button type="submit" className="btn-press h-12 rounded-full bg-coral px-6 text-[15px] font-medium text-white">
            Search
          </button>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="btn-press flex h-12 w-12 items-center justify-center rounded-full border sm:hidden"
            style={{ ...cardStyle, ...mutedText }}
            aria-label="Filters"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
        <div className={`${filtersOpen ? 'flex' : 'hidden'} sm:flex flex-wrap gap-2 mt-3`}>
          <div className="flex rounded-full border p-1" style={cardStyle}>
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`h-9 rounded-full px-4 text-[13px] font-medium ${type === t.value ? 'bg-coral text-white' : ''}`}
                style={type === t.value ? undefined : mutedText}
              >
                {t.label}
              </button>
            ))}
          </div>
          <select value={area} onChange={(e) => setArea(e.target.value)} className={selectCls} style={{ ...cardStyle, ...primaryText }} aria-label="Area">
            <option value="">All areas</option>
            {areas.map((a) => <option key={a.area} value={a.area}>{a.area} ({a.count})</option>)}
          </select>
          <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={selectCls} style={{ ...cardStyle, ...primaryText }} aria-label="Budget">
            <option value="">Any budget</option>
            {[20000, 50000, 100000, 200000].map((p) => <option key={p} value={p}>Up to {fmt(p)}</option>)}
          </select>
          <select value={minRating} onChange={(e) => setMinRating(e.target.value)} className={selectCls} style={{ ...cardStyle, ...primaryText }} aria-label="Rating">
            {RATINGS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectCls} style={{ ...cardStyle, ...primaryText }} aria-label="Sort">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </form>

      {error && <p className="mt-6 text-center text-[14px] text-red-500">{error}</p>}
      {loading && !data && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="h-72 rounded-2xl animate-pulse" style={{ backgroundColor: 'var(--bg-card)' }} />)}
        </div>
      )}

      {empty && (
        <div className="mt-12 text-center">
          <p className="text-[16px] font-medium" style={primaryText}>Nothing matches yet.</p>
          <p className="mt-1 text-[14px]" style={mutedText}>Try another word or area — or just ask Nira.</p>
          <Link href={chatHref(null, submitted || 'Help me find a beauty service near me')} className="btn-press mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-coral px-5 text-[14px] font-medium text-white">
            <MessageCircle size={16} /> Ask Nira
          </Link>
        </div>
      )}

      {data && (data.services.length > 0 || data.products.length > 0) && (
        <section className="mt-6">
          <h2 className="text-[17px] font-medium mb-3" style={primaryText}>Matching services & products</h2>
          <div className="-mx-4 sm:mx-0 flex gap-3 overflow-x-auto px-4 sm:px-0 pb-2 no-scrollbar">
            {data.services.map((s) => (
              <div key={s.service_id} className="w-[220px] shrink-0 overflow-hidden rounded-2xl border" style={cardStyle}>
                <Thumb url={s.image_url} emoji="💆🏾‍♀️" />
                <div className="p-3">
                  <p className="text-[14px] font-medium line-clamp-1" style={primaryText}>{s.service}</p>
                  <p className="text-[12px] line-clamp-1" style={mutedText}>{s.business} · {s.area}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[13px] font-medium text-coral">{fmt(s.price)}</span>
                    <span className="text-[12px]" style={mutedText}>{s.duration_minutes} min</span>
                  </div>
                  <Link href={chatHref(s.bot_code, `I'd like to book ${s.service} at ${s.business}`)}
                    className="btn-press mt-2 flex h-10 items-center justify-center rounded-full bg-coral text-[13px] font-medium text-white">
                    Book with Nira
                  </Link>
                </div>
              </div>
            ))}
            {data.products.map((p) => (
              <div key={p.product_id} className="w-[220px] shrink-0 overflow-hidden rounded-2xl border" style={cardStyle}>
                <Thumb url={p.image_url} emoji="🧴" />
                <div className="p-3">
                  <p className="text-[14px] font-medium line-clamp-1" style={primaryText}>{p.name}</p>
                  <p className="text-[12px] line-clamp-1" style={mutedText}>{p.business} · {p.area}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[13px] font-medium text-coral">{fmt(p.price)}</span>
                    {p.brand && <span className="text-[12px] line-clamp-1" style={mutedText}>{p.brand}</span>}
                  </div>
                  <Link href={chatHref(p.bot_code, `I'd like to order ${p.name} from ${p.business}`)}
                    className="btn-press mt-2 flex h-10 items-center justify-center rounded-full bg-coral text-[13px] font-medium text-white">
                    Order with Nira
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data && data.businesses.length > 0 && (
        <section className="mt-6">
          <h2 className="text-[17px] font-medium mb-3" style={primaryText}>
            {submitted ? `Businesses for “${submitted}”` : 'All businesses'} <span className="text-[14px]" style={mutedText}>({data.businesses.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.businesses.map((b) => (
              <div key={b.business_id} className="card-hover overflow-hidden rounded-2xl border flex flex-col" style={cardStyle}>
                <button onClick={() => openDetail(b.business_id)} className="text-left" aria-label={`View ${b.name}`}>
                  <Thumb url={b.image_url} emoji={b.type === 'salon_spa' ? '💇🏾‍♀️' : '🛍️'} />
                </button>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <button onClick={() => openDetail(b.business_id)} className="text-left">
                      <p className="text-[16px] font-medium" style={primaryText}>{b.name}</p>
                    </button>
                    <Rating value={b.avg_rating} count={b.total_reviews} />
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-[13px]" style={mutedText}>
                    <MapPin size={13} /> {b.area || 'Dar es Salaam'} · {b.type === 'salon_spa' ? 'Salon / Spa' : 'Beauty shop'}
                  </p>
                  {b.price_from != null && (
                    <p className="mt-1 text-[13px]" style={mutedText}>
                      From <span className="font-medium text-coral">{fmt(b.price_from)}</span>
                      {' · '}{b.type === 'salon_spa' ? `${b.services_count} services` : `${b.products_count} products`}
                    </p>
                  )}
                  {b.matching && b.matching.length > 0 && (
                    <p className="mt-2 text-[13px] line-clamp-2" style={primaryText}>
                      {b.matching.map((m) => `${m.name}${m.price != null ? ` (${fmt(m.price)})` : ''}`).join(' · ')}
                    </p>
                  )}
                  <div className="mt-auto flex gap-2 pt-4">
                    <Link href={chatHref(b.bot_code, b.type === 'salon_spa' ? `I'd like to book at ${b.name}` : `What do you recommend from ${b.name}?`)}
                      className="btn-press flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-coral text-[14px] font-medium text-white">
                      <MessageCircle size={15} /> {b.type === 'salon_spa' ? 'Book with Nira' : 'Shop with Nira'}
                    </Link>
                    <button onClick={() => openDetail(b.business_id)} className="btn-press h-11 rounded-full border px-4 text-[14px]" style={{ ...borderOnly, ...primaryText }}>
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data && (
        <p className="mt-10 text-center text-[13px]" style={mutedText}>
          Prefer WhatsApp?{' '}
          <a href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer" className="text-coral hover:underline">Chat with Nira on WhatsApp</a>
        </p>
      )}

      {/* Business detail drawer */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={() => setDetail(null)}>
          <div
            className="max-h-[88dvh] w-full sm:max-w-lg overflow-y-auto rounded-t-3xl sm:rounded-3xl"
            style={{ backgroundColor: 'var(--bg-card)' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={detail.name}
          >
            <div className="relative">
              <Thumb url={detail.image_url} emoji={detail.type === 'salon_spa' ? '💇🏾‍♀️' : '🛍️'} />
              <button onClick={() => setDetail(null)} className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-[24px] leading-tight" style={primaryText}>{detail.name}</h3>
                <Rating value={detail.avg_rating} count={detail.total_reviews} />
              </div>
              <p className="mt-1 flex items-center gap-1 text-[13px]" style={mutedText}><MapPin size={13} /> {detail.address || detail.area}</p>
              {detail.description && <p className="mt-3 text-[14px]" style={primaryText}>{detail.description}</p>}
              {detail.active_offers?.length > 0 && (
                <div className="mt-3 rounded-xl bg-coral-light px-3 py-2 text-[13px] text-coral-deep">
                  🎉 {detail.active_offers.map((o) => `${o.title} (${o.discount})`).join(' · ')}
                </div>
              )}
              {(detail.services?.length || 0) > 0 && (
                <div className="mt-4">
                  <p className="text-[12px] uppercase tracking-wide font-medium mb-2" style={mutedText}>Services</p>
                  <div className="divide-y" style={borderOnly}>
                    {detail.services!.slice(0, 12).map((s) => (
                      <Link key={s.service_id} href={chatHref(detail.bot_code, `I'd like to book ${s.name} at ${detail.name}`)}
                        className="flex min-h-[48px] items-center justify-between gap-3 py-2 hover:text-coral" style={primaryText}>
                        <span className="text-[14px]">{s.name} <span className="text-[12px]" style={mutedText}>· {s.duration_minutes} min</span></span>
                        <span className="text-[14px] font-medium text-coral whitespace-nowrap">{fmt(s.price)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {(detail.products?.length || 0) > 0 && (
                <div className="mt-4">
                  <p className="text-[12px] uppercase tracking-wide font-medium mb-2" style={mutedText}>Products</p>
                  <div className="divide-y" style={borderOnly}>
                    {detail.products!.slice(0, 12).map((p) => (
                      <Link key={p.product_id} href={chatHref(detail.bot_code, `I'd like to order ${p.name} from ${detail.name}`)}
                        className="flex min-h-[48px] items-center justify-between gap-3 py-2 hover:text-coral" style={primaryText}>
                        <span className="text-[14px]">{p.name}</span>
                        <span className="text-[14px] font-medium text-coral whitespace-nowrap">{fmt(p.price)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4">
                <p className="text-[12px] uppercase tracking-wide font-medium mb-1" style={mutedText}>Opening hours</p>
                <p className="text-[13px] leading-relaxed" style={primaryText}>{detail.opening_hours.map((h) => h.replace(' (default)', '')).join(' · ')}</p>
              </div>
              {detail.recent_reviews?.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-[12px] uppercase tracking-wide font-medium" style={mutedText}>Recent reviews</p>
                  {detail.recent_reviews.map((r, i) => (
                    <p key={i} className="text-[13px]" style={primaryText}>{'★'.repeat(r.rating)} “{r.comment}”</p>
                  ))}
                </div>
              )}
              <Link href={chatHref(detail.bot_code, detail.type === 'salon_spa' ? `I'd like to book at ${detail.name}` : `What do you recommend from ${detail.name}?`)}
                className="btn-press mt-5 flex h-12 items-center justify-center gap-2 rounded-full bg-coral text-[15px] font-medium text-white">
                <MessageCircle size={16} /> {detail.type === 'salon_spa' ? 'Book with Nira' : 'Shop with Nira'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
