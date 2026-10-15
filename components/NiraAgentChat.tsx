'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, Camera, Check, Compass, Plus, Sparkles, Star, X } from 'lucide-react'
import NiraWordmark from '@/components/NiraWordmark'
import ThemeToggle from '@/components/ThemeToggle'
import InstallChatApp from '@/components/InstallChatApp'
import { WHATSAPP_CHAT_URL } from '@/lib/links'

// Same fallback as lib/api.ts — NEXT_PUBLIC_API_URL has gone missing from
// the hosting dashboard before, and a relative URL silently hits this site.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nira-backend-w7p9.onrender.com'
const VISITOR_KEY = 'nira_agent_visitor_id'
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const POLL_MS = 20000

// Surfaces go through the CSS vars toggled by `.dark` (see globals.css).
const card = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }
const text1 = { color: 'var(--text-primary)' }
const text2 = { color: 'var(--text-muted)' }
const line = { borderColor: 'var(--border)' }

// ── Backend contract (app/routes/agent.py + app/ai/agent/channels.py) ─────────
type AgentButton = { id: string; title: string }
type ItemCard = {
  kind: 'service' | 'product' | 'business'
  id: string
  title: string
  subtitle?: string | null
  price?: number | null
  image_url?: string | null
  rating?: number | null
  meta?: string | null
}
type ActionCard = {
  kind: 'summary' | 'receipt'
  title: string
  rows: { label: string; value: string }[]
  total?: string | null
  total_label?: string
  note?: string | null
}
type AgentReply = {
  body: string
  buttons: AgentButton[]
  quick_replies: string[]
  card: ActionCard | null
  cards: ItemCard[]
  language: 'sw' | 'en'
  notifications?: string[]
}
type SessionState = {
  messages: { role: 'user' | 'assistant'; text: string; quick_replies?: string[] }[]
  buttons: AgentButton[]
  card: ActionCard | null
  home_business: { name: string; bot_code: string; type: string; logo_url: string | null } | null
}
type Msg = {
  id: number
  role: 'user' | 'assistant' | 'notice'
  text: string
  imageUrl?: string
  items?: ItemCard[]
  card?: ActionCard | null
  buttons?: AgentButton[]
  quick?: string[]
}

function visitorId(): string {
  const fresh = () => crypto.randomUUID().replace(/-/g, '')
  if (typeof window === 'undefined') return ''
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = fresh()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return fresh()
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 429) throw new Error('You’re sending messages quickly — wait a moment and try again.')
    throw new Error(typeof data.detail === 'string' ? data.detail : 'Could not reach Nira — try again.')
  }
  return data as T
}

const fmt = (n: number) => `TZS ${Math.round(n).toLocaleString('en-US')}`

/** WhatsApp-style *bold* → <strong>, paragraphs spaced. */
function RichText({ text }: { text: string }) {
  return (
    <div className="space-y-2 text-[15px] leading-[1.6]">
      {text.split(/\n{2,}/).map((para, pi) => (
        <p key={pi} className="whitespace-pre-wrap">
          {para.split(/(\*[^*\n]+\*)/g).map((part, i) =>
            part.length > 2 && part.startsWith('*') && part.endsWith('*') ? (
              <strong key={i} className="font-medium">{part.slice(1, -1)}</strong>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </p>
      ))}
    </div>
  )
}

function NiraAvatar({ size = 32 }: { size?: number }) {
  return (
    <div className="flex shrink-0 items-center justify-center rounded-full bg-coral text-white" style={{ width: size, height: size }} aria-hidden="true">
      <Sparkles size={size * 0.5} />
    </div>
  )
}

const SUGGESTIONS = [
  { emoji: '💆🏾‍♀️', title: 'Book a facial', sub: 'Tomorrow, under TZS 50,000', prompt: 'Book me a facial tomorrow under TZS 50,000' },
  { emoji: '🧴', title: 'Find a moisturizer', sub: 'Matched to my skin', prompt: 'I need a moisturizer' },
  { emoji: '💇🏾‍♀️', title: 'Kusuka nywele', sub: 'Jumamosi, karibu nami', prompt: 'Nataka kusuka nywele Jumamosi' },
  { emoji: '🎁', title: 'This week’s offers', sub: 'Discounts near you', prompt: 'What offers are on this week?' },
]

// ── Pieces ───────────────────────────────────────────────────────────────────

function ItemStrip({ items, onAsk, disabled }: { items: ItemCard[]; onAsk: (c: ItemCard) => void; disabled: boolean }) {
  return (
    <div className="-mx-1 mt-3 flex gap-3 overflow-x-auto px-1 pb-1 no-scrollbar">
      {items.map((c) => (
        <button
          key={`${c.kind}-${c.id}`}
          onClick={() => onAsk(c)}
          disabled={disabled}
          className="group w-[176px] shrink-0 overflow-hidden rounded-2xl border text-left transition hover:-translate-y-0.5 hover:shadow-card-hover disabled:opacity-60"
          style={card}
        >
          <div className="relative h-28 w-full overflow-hidden">
            {c.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image_url} alt="" className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-lavender-light text-3xl">
                {c.kind === 'product' ? '🧴' : c.kind === 'service' ? '💆🏾‍♀️' : '🏪'}
              </div>
            )}
            {c.rating ? (
              <span className="absolute left-2 top-2 flex items-center gap-0.5 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white">
                <Star size={10} className="fill-amber-400 text-amber-400" /> {c.rating}
              </span>
            ) : null}
          </div>
          <div className="space-y-0.5 p-3">
            <p className="line-clamp-2 text-[13px] font-medium leading-snug" style={text1}>{c.title}</p>
            {c.subtitle && <p className="truncate text-[11px]" style={text2}>{c.subtitle}</p>}
            {c.price != null && <p className="pt-1 text-[13px] font-medium text-coral">{fmt(c.price)}</p>}
          </div>
        </button>
      ))}
    </div>
  )
}

function ActionCardView({ c, buttons, onPick, disabled }: {
  c: ActionCard; buttons?: AgentButton[]; onPick: (b: AgentButton) => void; disabled: boolean
}) {
  const receipt = c.kind === 'receipt'
  return (
    <div className="mt-3 w-full max-w-[420px] overflow-hidden rounded-2xl border shadow-card" style={card}>
      <div className={`flex items-center gap-2 px-4 py-3 text-[14px] font-medium ${receipt ? 'bg-mint-light text-mint-deep' : 'bg-coral-light text-coral-deep'}`}>
        {receipt ? <Check size={16} /> : <Sparkles size={15} />} {c.title}
      </div>
      <dl className="px-4">
        {c.rows.map((r, i) => (
          <div key={i} className="flex items-start justify-between gap-4 border-b py-2.5 text-[14px]" style={line}>
            <dt style={text2}>{r.label}</dt>
            <dd className="text-right font-medium" style={text1}>{r.value}</dd>
          </div>
        ))}
        {c.total && (
          <div className="flex items-center justify-between py-3">
            <dt className="text-[15px] font-medium" style={text1}>{c.total_label || 'Total'}</dt>
            <dd className="font-serif text-[22px] text-coral">{c.total}</dd>
          </div>
        )}
      </dl>
      {c.note && <p className="px-4 pb-3 text-[12px]" style={text2}>{c.note}</p>}
      {buttons && buttons.length > 0 && (
        <div className="flex gap-2 border-t p-3" style={line}>
          {buttons.map((b) => {
            const primary = b.id.startsWith('agent_confirm')
            return (
              <button
                key={b.id}
                disabled={disabled}
                onClick={() => onPick(b)}
                className={primary
                  ? 'btn-press h-11 flex-1 rounded-xl bg-coral text-[14px] font-medium text-white shadow-btn-coral disabled:opacity-50'
                  : 'btn-press h-11 rounded-xl border px-5 text-[14px] disabled:opacity-50'}
                style={primary ? undefined : { ...line, ...text1 }}
              >
                {b.title}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function QuickReplies({ options, onPick, disabled }: { options: string[]; onPick: (o: string) => void; disabled: boolean }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          disabled={disabled}
          onClick={() => onPick(o)}
          className="btn-press min-h-[40px] rounded-full border px-4 text-[14px] transition hover:border-coral hover:text-coral disabled:opacity-50"
          style={{ ...card, ...text1 }}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function NiraAgentChat({ initialBotCode, initialMessage }: { initialBotCode?: string; initialMessage?: string }) {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [home, setHome] = useState<SessionState['home_business']>(null)
  const [image, setImage] = useState<{ b64: string; type: string; preview: string } | null>(null)
  const [restored, setRestored] = useState(false)

  const vidRef = useRef('')
  const idRef = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const startedRef = useRef(false)

  const nextId = () => ++idRef.current
  const scrollDown = useCallback(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    })
  }, [])

  // Auto-grow the composer up to ~5 lines.
  useLayoutEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [input])

  const addNotices = useCallback((texts?: string[]) => {
    if (!texts?.length) return
    setMessages((prev) => [...prev, ...texts.map((t) => ({ id: nextId(), role: 'notice' as const, text: t }))])
    scrollDown()
  }, [scrollDown])

  const send = useCallback(
    async (text: string, opts?: { display?: string; silent?: boolean }) => {
      if (sending) return
      const img = image
      setMessages((prev) => [
        // Buttons and quick replies are spent once anything new is sent.
        ...prev.map((m) => (m.buttons?.length || m.quick?.length ? { ...m, buttons: [], quick: [] } : m)),
        ...(opts?.silent ? [] : [{ id: nextId(), role: 'user' as const, text: opts?.display ?? text, imageUrl: img?.preview }]),
      ])
      setImage(null)
      setSending(true)
      setError(null)
      scrollDown()
      try {
        const reply = await call<AgentReply>('/agent/web/message', {
          method: 'POST',
          body: JSON.stringify({
            visitor_id: vidRef.current,
            message: text,
            bot_code: initialBotCode ?? null,
            image_b64: img?.b64 ?? null,
            image_media_type: img?.type ?? null,
          }),
        })
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(), role: 'assistant', text: reply.body, items: reply.cards, card: reply.card,
            buttons: reply.buttons, quick: reply.quick_replies,
          },
        ])
        addNotices(reply.notifications)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not reach Nira — try again.')
      } finally {
        setSending(false)
        scrollDown()
        inputRef.current?.focus()
      }
    },
    [sending, image, initialBotCode, scrollDown, addNotices],
  )

  // Restore the conversation after a reload.
  useEffect(() => {
    vidRef.current = visitorId()
    let cancelled = false
    call<SessionState>(`/agent/web/session?visitor_id=${encodeURIComponent(vidRef.current)}`)
      .then((s) => {
        if (cancelled) return
        setHome(s.home_business)
        const restoredMsgs: Msg[] = s.messages.map((m) => ({ id: nextId(), role: m.role, text: m.text }))
        const last = restoredMsgs[restoredMsgs.length - 1]
        if (last?.role === 'assistant') {
          last.quick = s.messages[s.messages.length - 1].quick_replies
          if (s.card) {
            last.card = s.card
            last.buttons = s.buttons
          }
        }
        setMessages(restoredMsgs)
        scrollDown()
      })
      .catch(() => {})
      .finally(() => !cancelled && setRestored(true))
    return () => {
      cancelled = true
    }
  }, [scrollDown])

  // A listing link ("Book with Nira") or a business link starts the chat.
  useEffect(() => {
    if (!restored || startedRef.current) return
    if (initialMessage) {
      startedRef.current = true
      send(initialMessage)
    } else if (initialBotCode) {
      startedRef.current = true
      if (!(home?.bot_code?.toLowerCase() === initialBotCode.toLowerCase() && messages.length)) {
        send(initialBotCode, { silent: true })
      }
    }
  }, [restored, initialBotCode, initialMessage, home, messages.length, send])

  // Payment receipts and offers arrive asynchronously.
  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState !== 'visible' || !vidRef.current) return
      call<{ notifications: string[] }>(`/agent/web/updates?visitor_id=${encodeURIComponent(vidRef.current)}`)
        .then((r) => addNotices(r.notifications))
        .catch(() => {})
    }, POLL_MS)
    return () => clearInterval(t)
  }, [addNotices])

  const onPickImage = (file?: File) => {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return setError('Please choose a JPG, PNG or WebP photo.')
    if (file.size > MAX_IMAGE_BYTES) return setError('That photo is over 5 MB — try a smaller one.')
    const reader = new FileReader()
    reader.onload = () => {
      const url = String(reader.result)
      setImage({ b64: url.split(',')[1], type: file.type, preview: url })
    }
    reader.readAsDataURL(file)
  }

  const submit = () => {
    const t = input.trim()
    if ((!t && !image) || sending) return
    setInput('')
    send(t || 'What do you think of this?')
  }

  const newChat = async () => {
    try {
      await call('/agent/web/reset', { method: 'POST', body: JSON.stringify({ visitor_id: vidRef.current }) })
    } catch {
      /* the next message still works */
    }
    setMessages([])
    setHome(null)
    setError(null)
    startedRef.current = true
    inputRef.current?.focus()
  }

  const askAboutItem = (c: ItemCard) => {
    const where = c.subtitle ? ` at ${c.subtitle.split(' · ')[0]}` : ''
    send(c.kind === 'service' ? `I'd like to book ${c.title}${where}`
      : c.kind === 'product' ? `Tell me more about ${c.title}${where}` : `Tell me about ${c.title}`)
  }

  const lastAssistantId = [...messages].reverse().find((m) => m.role === 'assistant')?.id
  const empty = restored && messages.length === 0 && !initialBotCode && !initialMessage

  return (
    <div className="flex h-full flex-col">
      {/* ── Header: only what matters ─────────────────────────────────── */}
      <header className="z-10 flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-5" style={{ ...line, backgroundColor: 'var(--bg-page)' }}>
        <Link href="/" className="flex items-center" aria-label="Nira home">
          <NiraWordmark size="sm" />
        </Link>
        <span className="hidden items-center rounded-full bg-coral-light px-2 py-0.5 text-[11px] font-medium text-coral-deep sm:inline-flex">
          AI beauty agent
        </span>
        {home && (
          <span className="ml-1 truncate rounded-full border px-2.5 py-0.5 text-[12px]" style={{ ...line, ...text2 }}>
            with {home.name}
          </span>
        )}
        <nav className="ml-auto flex items-center gap-1">
          <InstallChatApp />
          <Link href="/explore" className="flex h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium hover:text-coral" style={text2}>
            <Compass size={16} /> <span className="hidden sm:inline">Explore</span>
          </Link>
          <a href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer"
            className="hidden h-10 items-center rounded-full px-3 text-[13px] font-medium hover:text-coral sm:flex" style={text2}>
            WhatsApp
          </a>
          <button onClick={newChat}
            className="flex h-10 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium hover:border-coral hover:text-coral"
            style={{ ...line, ...text1 }}>
            <Plus size={15} /> <span className="hidden sm:inline">New chat</span>
          </button>
          <div className="ml-1 hidden sm:block"><ThemeToggle /></div>
        </nav>
      </header>

      {/* ── Conversation ─────────────────────────────────────────────── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto" aria-live="polite">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
          {empty && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-[6vh] text-center">
              <div className="mx-auto mb-5 w-fit"><NiraAvatar size={52} /></div>
              <h1 className="font-serif text-[32px] leading-tight sm:text-[40px]" style={text1}>Habari! What can I find for you?</h1>
              <p className="mx-auto mt-2 max-w-md text-[15px]" style={text2}>
                Salons, spas and beauty products across Dar es Salaam — I compare, book and order for you. Kiswahili au English.
              </p>
              <div className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-3 text-left sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.title}
                    onClick={() => send(s.prompt)}
                    className="btn-press flex min-h-[64px] items-center gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-coral hover:shadow-card-hover"
                    style={card}
                  >
                    <span className="text-2xl" aria-hidden="true">{s.emoji}</span>
                    <span>
                      <span className="block text-[14px] font-medium" style={text1}>{s.title}</span>
                      <span className="block text-[12px]" style={text2}>{s.sub}</span>
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((m) =>
                m.role === 'notice' ? (
                  <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mx-auto w-fit max-w-[90%] rounded-full bg-mint-light px-4 py-2 text-center text-[13px] text-mint-deep">
                    {m.text}
                  </motion.div>
                ) : m.role === 'user' ? (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-end">
                    {m.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.imageUrl} alt="" className="mb-1.5 max-h-52 rounded-2xl object-cover" />
                    )}
                    {m.text && (
                      <div className="max-w-[85%] rounded-3xl rounded-br-lg bg-coral px-4 py-2.5 text-white">
                        <RichText text={m.text} />
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                    <NiraAvatar />
                    <div className="min-w-0 flex-1 pt-1" style={text1}>
                      {m.text && <RichText text={m.text} />}
                      {m.card && (
                        <ActionCardView
                          c={m.card}
                          buttons={m.id === lastAssistantId ? m.buttons : []}
                          onPick={(b) => send(b.id, { display: b.title })}
                          disabled={sending}
                        />
                      )}
                      {!m.card && m.items && m.items.length > 0 && (
                        <ItemStrip items={m.items} onAsk={askAboutItem} disabled={sending} />
                      )}
                      {m.id === lastAssistantId && m.quick && m.quick.length > 0 && (
                        <QuickReplies options={m.quick} onPick={(o) => send(o)} disabled={sending} />
                      )}
                    </div>
                  </motion.div>
                ),
              )}
            </AnimatePresence>

            {sending && (
              <div className="flex gap-3" aria-label="Nira is typing">
                <NiraAvatar />
                <div className="flex items-center gap-1 pt-3">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-coral/70" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            {error && <p className="text-center text-[13px] text-red-500">{error}</p>}
          </div>
        </div>
      </div>

      {/* ── Composer + one-line footer ───────────────────────────────── */}
      <div className="shrink-0 px-3 pb-3 pt-2 sm:px-6" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="mx-auto w-full max-w-3xl">
          <form
            onSubmit={(e) => { e.preventDefault(); submit() }}
            className="rounded-3xl border p-2 shadow-card transition focus-within:border-coral"
            style={card}
          >
            {image && (
              <div className="mb-2 flex items-center gap-2 px-2 pt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.preview} alt="" className="h-14 w-14 rounded-xl object-cover" />
                <button type="button" onClick={() => setImage(null)} className="rounded-full p-1" style={text2} aria-label="Remove photo">
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="flex items-end gap-1">
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={(e) => { onPickImage(e.target.files?.[0]); e.target.value = '' }} />
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:text-coral" style={text2} aria-label="Send a photo">
                <Camera size={19} />
              </button>
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    submit()
                  }
                }}
                placeholder="Ask Nira anything…"
                maxLength={2000}
                className="max-h-[140px] min-h-[40px] flex-1 resize-none bg-transparent px-1 py-2.5 text-[15px] outline-none"
                style={text1}
                aria-label="Message"
              />
              <button type="submit" disabled={sending || (!input.trim() && !image)}
                className="btn-press flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral text-white transition disabled:opacity-30"
                aria-label="Send">
                <ArrowUp size={19} />
              </button>
            </div>
          </form>
          <p className="mt-2 text-center text-[11px] leading-snug" style={text2}>
            Nira always asks before booking or charging<span className="hidden sm:inline"> · bookings share your name &amp; number with the business</span> ·{' '}
            <Link href="/privacy" className="hover:text-coral">Privacy</Link> · <Link href="/terms" className="hover:text-coral">Terms</Link> · © Nira
          </p>
        </div>
      </div>
    </div>
  )
}
