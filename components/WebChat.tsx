'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const VISITOR_KEY = 'nira_web_visitor_id'

// This site themes via CSS custom properties toggled on a `.dark` class
// (see globals.css), not Tailwind's `dark:` variant — Tailwind's darkMode
// isn't set to "class" here, so `dark:` utilities are silently inert.
// Surface/text/border colors that must respond to the toggle go through
// these vars; brand accents (coral/mint) are theme-invariant and stay as
// plain Tailwind classes.
const cardStyle = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }
const pageStyle = { backgroundColor: 'var(--bg-page)' }
const primaryText = { color: 'var(--text-primary)' }
const mutedText = { color: 'var(--text-muted)' }
const borderOnly = { borderColor: 'var(--border)' }

// ── Types mirroring the backend's response contract (app/ai/engine.py) ────────
type ButtonOpt = { type: 'reply'; reply: { id: string; title: string } }
type ListRow = { id: string; title: string; description?: string }
type ListSection = { title: string; rows: ListRow[] }

type ChatResult = {
  type: 'text' | 'buttons' | 'list'
  body: string
  buttons?: ButtonOpt[]
  sections?: ListSection[]
  header?: string
  button_text?: string
  image_url?: string
  detail?: string
}

type Bubble = {
  id: number
  dir: 'in' | 'out'
  result: ChatResult
}

type BusinessInfo = { bot_code: string; name: string; type: string; logo_url: string | null; city: string | null }
type BusinessResult = {
  id: string; name: string; type: string; avg_rating: number; total_reviews: number
  city: string | null; city_area: string | null; address: string | null; bot_code: string
}
type ProductResult = {
  id: string; name: string; price: number; brand: string | null; category: string
  business_name: string; bot_code: string
}

function getVisitorId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(VISITOR_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(VISITOR_KEY, id)
  }
  return id
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Something went wrong')
  return data as T
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Something went wrong')
  return data as T
}

// ── Message bubble rendering ───────────────────────────────────────────────

function TextBubble({ result }: { result: ChatResult }) {
  return (
    <>
      {result.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={result.image_url}
          alt=""
          className="mb-1.5 w-full max-w-[220px] rounded-2xl rounded-tl-sm object-cover"
        />
      )}
      <p className="whitespace-pre-wrap text-[14px] leading-relaxed">{result.body}</p>
    </>
  )
}

function ButtonsBubble({ result, onPick }: { result: ChatResult; onPick: (id: string, label: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="whitespace-pre-wrap text-[14px] leading-relaxed">{result.body}</p>
      <div className="flex flex-wrap gap-2 pt-1">
        {result.buttons?.map((b) => (
          <button
            key={b.reply.id}
            onClick={() => onPick(b.reply.id, b.reply.title)}
            className="btn-press rounded-full border border-coral bg-coral-light px-4 py-2 text-[13px] font-medium text-coral-dark hover:bg-coral hover:text-white"
          >
            {b.reply.title}
          </button>
        ))}
      </div>
    </div>
  )
}

function ListBubble({ result, onPick }: { result: ChatResult; onPick: (id: string, label: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="whitespace-pre-wrap text-[14px] leading-relaxed">{result.body}</p>
      <div className="flex flex-col gap-1.5 pt-1">
        {result.sections?.map((section) =>
          section.rows.map((row) => (
            <button
              key={row.id}
              onClick={() => onPick(row.id, row.title)}
              className="btn-press flex flex-col items-start rounded-xl border px-3.5 py-2.5 text-left hover:border-coral"
              style={cardStyle}
            >
              <span className="text-[13px] font-medium" style={primaryText}>{row.title}</span>
              {row.description && <span className="text-[11px]" style={mutedText}>{row.description}</span>}
            </button>
          ))
        )}
      </div>
    </div>
  )
}

function Bubble({ bubble, onPick }: { bubble: Bubble; onPick: (id: string, label: string) => void }) {
  // dir "out" = the visitor's own sent message (always plain text — see
  // sendMessage). dir "in" = Nira's reply, the only place buttons/list
  // types ever appear, so onPick only needs wiring there.
  const isUser = bubble.dir === 'out'
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      style={{ animation: 'slideInMsg 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
          isUser ? 'rounded-tr-sm bg-coral text-white' : 'rounded-tl-sm'
        }`}
        style={isUser ? undefined : { backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
      >
        {bubble.result.type === 'text' && <TextBubble result={bubble.result} />}
        {bubble.result.type === 'buttons' && <ButtonsBubble result={bubble.result} onPick={onPick} />}
        {bubble.result.type === 'list' && <ListBubble result={bubble.result} onPick={onPick} />}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div
        className="flex items-center gap-1 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: 'var(--text-muted)',
              animation: 'typing-dot 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ── Landing: choose intent before any business is picked ──────────────────────

function Landing({
  onDirectCode,
  onExploreBusinesses,
  onExploreProducts,
}: {
  onDirectCode: (code: string) => void
  onExploreBusinesses: () => void
  onExploreProducts: () => void
}) {
  const [code, setCode] = useState('')
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-coral text-2xl text-white shadow-lg">
          💬
        </div>
        <h1 className="font-serif text-3xl" style={primaryText}>Chat with Nira</h1>
        <p className="max-w-sm text-sm" style={mutedText}>
          Your beauty AI companion — book appointments, order products, or get skincare advice.
          Are you looking for something specific, or already know who you want to talk to?
        </p>
      </div>

      <div className="grid w-full max-w-md gap-3">
        <button
          onClick={onExploreProducts}
          className="btn-press card-hover flex items-center gap-4 rounded-2xl border p-4 text-left"
          style={cardStyle}
        >
          <span className="text-2xl">🔍</span>
          <span>
            <span className="block text-sm font-medium" style={primaryText}>Looking for a product</span>
            <span className="block text-xs" style={mutedText}>Explore items across shops near you</span>
          </span>
        </button>

        <button
          onClick={onExploreBusinesses}
          className="btn-press card-hover flex items-center gap-4 rounded-2xl border p-4 text-left"
          style={cardStyle}
        >
          <span className="text-2xl">💇</span>
          <span>
            <span className="block text-sm font-medium" style={primaryText}>Looking for a salon or beauty shop</span>
            <span className="block text-xs" style={mutedText}>Explore businesses on Nira</span>
          </span>
        </button>

        <div className="flex items-center gap-3 rounded-2xl border p-4" style={cardStyle}>
          <span className="text-2xl">🔑</span>
          <div className="flex flex-1 items-center gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && code.trim() && onDirectCode(code.trim())}
              placeholder="I have a business code"
              className="w-full bg-transparent text-sm outline-none"
              style={primaryText}
            />
            <button
              disabled={!code.trim()}
              onClick={() => onDirectCode(code.trim())}
              className="btn-press rounded-full bg-coral px-4 py-1.5 text-xs font-medium text-white disabled:opacity-40"
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Explore: marketplace search before a business is chosen ───────────────────

function ExploreBusinesses({ onPick, onBack }: { onPick: (code: string, name: string) => void; onBack: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BusinessResult[]>([])
  const [loading, setLoading] = useState(true)

  const search = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const res = await apiPost<{ results: BusinessResult[] }>('/webchat/search/businesses', { query: q || null })
      setResults(res.results)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { search('') }, [search])

  return (
    <div className="flex flex-1 flex-col px-5 py-6">
      <button onClick={onBack} className="btn-press mb-4 self-start text-xs hover:text-coral" style={mutedText}>
        ← Back
      </button>
      <h2 className="mb-3 text-lg font-medium" style={primaryText}>Salons & beauty shops</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && search(query)}
        placeholder="Search by name or area…"
        className="mb-4 rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-coral"
        style={{ ...cardStyle, ...primaryText }}
      />
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto no-scrollbar">
        {loading && <p className="text-sm" style={mutedText}>Searching…</p>}
        {!loading && results.length === 0 && <p className="text-sm" style={mutedText}>No businesses found.</p>}
        {results.map((b) => (
          <button
            key={b.id}
            onClick={() => onPick(b.bot_code, b.name)}
            className="btn-press card-hover flex flex-col items-start rounded-xl border p-4 text-left"
            style={cardStyle}
          >
            <span className="text-sm font-medium" style={primaryText}>{b.name}</span>
            <span className="text-xs" style={mutedText}>
              {b.type === 'salon_spa' ? 'Salon / Spa' : 'Cosmetic Shop'}
              {b.city_area ? ` · ${b.city_area}` : b.city ? ` · ${b.city}` : ''}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ExploreProducts({ onPick, onBack }: { onPick: (code: string, name: string, product: string) => void; onBack: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ProductResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await apiPost<{ results: ProductResult[] }>('/webchat/search/products', { query: q })
      setResults(res.results)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="flex flex-1 flex-col px-5 py-6">
      <button onClick={onBack} className="btn-press mb-4 self-start text-xs hover:text-coral" style={mutedText}>
        ← Back
      </button>
      <h2 className="mb-3 text-lg font-medium" style={primaryText}>Find a product</h2>
      <div className="mb-4 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search(query)}
          placeholder="e.g. vitamin C serum"
          className="flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-coral"
          style={{ ...cardStyle, ...primaryText }}
        />
        <button
          onClick={() => search(query)}
          className="btn-press rounded-xl bg-coral px-4 text-sm font-medium text-white"
        >
          Search
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto no-scrollbar">
        {loading && <p className="text-sm" style={mutedText}>Searching…</p>}
        {!loading && searched && results.length === 0 && <p className="text-sm" style={mutedText}>No products found.</p>}
        {results.map((p) => (
          <button
            key={p.id}
            onClick={() => onPick(p.bot_code, p.business_name, p.name)}
            className="btn-press card-hover flex items-center justify-between rounded-xl border p-4 text-left"
            style={cardStyle}
          >
            <span>
              <span className="block text-sm font-medium" style={primaryText}>{p.name}</span>
              <span className="block text-xs" style={mutedText}>{p.business_name}{p.brand ? ` · ${p.brand}` : ''}</span>
            </span>
            <span className="text-xs font-medium text-coral">TZS {p.price.toLocaleString()}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

type Phase = 'landing' | 'browse_businesses' | 'browse_products' | 'chat'

export default function WebChat({ initialBotCode }: { initialBotCode?: string }) {
  const [phase, setPhase] = useState<Phase>(initialBotCode ? 'chat' : 'landing')
  const [botCode, setBotCode] = useState<string | null>(initialBotCode ?? null)
  const [business, setBusiness] = useState<BusinessInfo | null>(null)
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [sending, setSending] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const visitorIdRef = useRef('')
  const pendingIntroRef = useRef<string | null>(null)
  const bubbleIdRef = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    visitorIdRef.current = getVisitorId()
  }, [])

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    })
  }, [])

  const postMessage = useCallback(async (text: string) => {
    return apiPost<ChatResult>('/webchat/message', {
      visitor_id: visitorIdRef.current,
      bot_code: botCode,
      message: text,
    })
  }, [botCode])

  const sendMessage = useCallback(async (text: string, opts?: { silent?: boolean }) => {
    if (!opts?.silent) {
      bubbleIdRef.current += 1
      setBubbles((prev) => [...prev, { id: bubbleIdRef.current, dir: 'out', result: { type: 'text', body: text } }])
      scrollToBottom()
    }
    setSending(true)
    setError(null)
    try {
      const result = await postMessage(text)
      bubbleIdRef.current += 1
      setBubbles((prev) => [...prev, { id: bubbleIdRef.current, dir: 'in', result }])
      scrollToBottom()

      if (pendingIntroRef.current && result.type === 'text') {
        const intro = pendingIntroRef.current
        pendingIntroRef.current = null
        setSending(false)
        await sendMessage(intro)
        return
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not reach Nira — try again.')
    } finally {
      setSending(false)
    }
  }, [postMessage, scrollToBottom])

  const beginChat = useCallback(async (code: string, intro?: string) => {
    setBotCode(code)
    setBusiness(null)
    setBubbles([])
    setError(null)
    pendingIntroRef.current = intro ?? null
    setPhase('chat')

    try {
      const info = await apiGet<BusinessInfo>(`/webchat/business/${code}`)
      setBusiness(info)
    } catch {
      setError('Could not find that business.')
      setPhase('landing')
      return
    }
  }, [])

  // Kick off the language-select screen once we're in chat phase with a code
  useEffect(() => {
    if (phase !== 'chat' || !botCode || startedRef.current) return
    if (!visitorIdRef.current) visitorIdRef.current = getVisitorId()
    startedRef.current = true
    sendMessage('hi', { silent: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, botCode])

  const onPick = useCallback((id: string) => {
    if (sending) return
    sendMessage(id)
  }, [sending, sendMessage])

  const onSubmitInput = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    sendMessage(text)
  }, [input, sending, sendMessage])

  const resetToLanding = useCallback(() => {
    startedRef.current = false
    setPhase('landing')
    setBotCode(null)
    setBusiness(null)
    setBubbles([])
  }, [])

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-2xl flex-col" style={pageStyle}>
      <AnimatePresence mode="wait">
        {phase === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1 flex-col">
            <Landing
              onDirectCode={(code) => beginChat(code.toLowerCase())}
              onExploreBusinesses={() => setPhase('browse_businesses')}
              onExploreProducts={() => setPhase('browse_products')}
            />
          </motion.div>
        )}

        {phase === 'browse_businesses' && (
          <motion.div key="browse_businesses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1 flex-col">
            <ExploreBusinesses onBack={() => setPhase('landing')} onPick={(code) => beginChat(code)} />
          </motion.div>
        )}

        {phase === 'browse_products' && (
          <motion.div key="browse_products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1 flex-col">
            <ExploreProducts
              onBack={() => setPhase('landing')}
              onPick={(code, shopName, productName) => beginChat(code, `Hi, I'm interested in ${productName}`)}
            />
          </motion.div>
        )}

        {phase === 'chat' && (
          <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1 flex-col">
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b px-4 py-3" style={borderOnly}>
              <button onClick={resetToLanding} className="btn-press hover:text-coral" style={mutedText} aria-label="Back">
                ←
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-sm font-medium text-white">
                {business?.name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" style={primaryText}>{business?.name ?? 'Loading…'}</p>
                <p className="flex items-center gap-1 text-[11px]" style={mutedText}>
                  <span className="h-1.5 w-1.5 rounded-full bg-mint" style={{ animation: 'pulse-soft 2s ease-in-out infinite' }} />
                  Nira AI · online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-4 no-scrollbar">
              {bubbles.map((b) => (
                <Bubble key={b.id} bubble={b} onPick={onPick} />
              ))}
              {sending && <TypingDots />}
              {error && <p className="text-center text-xs text-red-500">{error}</p>}
            </div>

            {/* Input */}
            <form onSubmit={onSubmitInput} className="flex items-center gap-2 border-t px-4 py-3" style={borderOnly}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                disabled={sending}
                className="flex-1 rounded-full border px-4 py-2.5 text-sm outline-none focus:border-coral"
                style={{ ...cardStyle, ...primaryText }}
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="btn-press flex h-10 w-10 items-center justify-center rounded-full bg-coral text-white disabled:opacity-40"
                aria-label="Send"
              >
                ➤
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
