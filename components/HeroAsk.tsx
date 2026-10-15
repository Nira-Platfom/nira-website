'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUp, Sparkles } from 'lucide-react'

// Example requests the placeholder cycles through — what people actually ask.
const EXAMPLES = [
  'Facial tomorrow in Masaki under TZS 50,000',
  'Nataka kusuka rasta Jumamosi, Sinza',
  'A sunscreen for oily skin',
  'Manicure today after 5pm',
]

const CHIPS = [
  { label: 'Book a facial', q: 'Book me a facial tomorrow' },
  { label: 'Skin care for me', q: 'I need a moisturizer' },
  { label: 'Kusuka nywele', q: 'Nataka kusuka nywele Jumamosi' },
  { label: 'Offers near me', q: 'What offers are on this week?' },
]

/** The hero's "ask Nira" box: type a request, land in the chat with it. */
export default function HeroAsk() {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [example, setExample] = useState(0)
  const [typed, setTyped] = useState(EXAMPLES[0].slice(0, 1))

  // Typewriter placeholder: type the example, hold, move to the next one.
  useEffect(() => {
    if (value) return
    const full = EXAMPLES[example]
    if (typed.length < full.length) {
      const t = setTimeout(() => setTyped(full.slice(0, typed.length + 1)), 38)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setTyped('')
      setExample((example + 1) % EXAMPLES.length)
    }, 2200)
    return () => clearTimeout(t)
  }, [typed, example, value])

  const go = (q: string) => {
    const text = q.trim()
    router.push(text ? `/chat?q=${encodeURIComponent(text)}` : '/chat')
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          go(value || EXAMPLES[example])
        }}
        className="group relative flex items-center gap-2 rounded-2xl border p-2 pl-4 transition-all duration-300 focus-within:border-coral focus-within:shadow-[0_0_0_4px_rgba(255,107,107,0.15)] hover:shadow-card-hover"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}
      >
        <Sparkles size={18} className="shrink-0 text-coral" aria-hidden="true" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={typed || 'Ask Nira anything…'}
          aria-label="Ask Nira what you need"
          className="h-11 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:transition-opacity"
          style={{ color: 'var(--text-primary)' }}
        />
        <button
          type="submit"
          className="btn-press flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-coral px-4 text-[14px] font-medium text-white shadow-btn-coral transition-transform hover:scale-[1.03]"
          aria-label="Ask Nira"
        >
          <span className="hidden sm:inline">Ask Nira</span>
          <ArrowUp size={17} />
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {CHIPS.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => go(c.q)}
            className="btn-press rounded-full border px-3.5 py-1.5 text-[13px] transition-colors hover:border-coral hover:text-coral"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)' }}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}
