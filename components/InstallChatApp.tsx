'use client'

import { useEffect, useState } from 'react'
import { Download, MoreVertical, Share, SquarePlus, X } from 'lucide-react'

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

// The Nira Chat home-screen app lives on its own origin so phones treat it
// as a separate app from Nira Business (www.beautynira.com, whose app scope
// covers the whole main site — including /chat).
const CHAT_ORIGIN = process.env.NEXT_PUBLIC_CHAT_ORIGIN || 'https://chat.beautynira.com'
const VISITOR_KEY = 'nira_agent_visitor_id'

const text1 = { color: 'var(--text-primary)' }
const text2 = { color: 'var(--text-muted)' }

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true
}
function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}
function onChatHost() {
  return window.location.hostname.startsWith('chat.')
}

/** URL of the chat app carrying this browser's conversation along, so
 * moving to the app doesn't start the customer from scratch. */
function chatAppUrl(): string {
  let vid = ''
  try {
    vid = localStorage.getItem(VISITOR_KEY) || ''
  } catch {
    /* private mode */
  }
  const origin = window.location.hostname.endsWith('localhost')
    ? `${window.location.protocol}//chat.${window.location.host}`
    : CHAT_ORIGIN
  return `${origin}/${vid ? `?vid=${encodeURIComponent(vid)}` : ''}`
}

export default function InstallChatApp() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [mode, setMode] = useState<'hidden' | 'prompt' | 'ios' | 'android-menu' | 'move'>('hidden')
  const [sheet, setSheet] = useState(false)

  useEffect(() => {
    if (isStandalone()) return // already running as the installed app
    if (!onChatHost()) {
      setMode('move')
      return
    }
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/chat-sw.js', { scope: '/' }).catch(() => {})
    setMode(isIOS() ? 'ios' : 'android-menu')
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setMode('prompt')
    }
    const onInstalled = () => {
      setDeferred(null)
      setMode('hidden')
      setSheet(false)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (mode === 'hidden') return null

  const onClick = async () => {
    if (mode === 'prompt' && deferred) {
      await deferred.prompt()
      await deferred.userChoice.catch(() => null)
      setDeferred(null)
      return
    }
    setSheet(true)
  }

  const step = (icon: React.ReactNode, body: React.ReactNode) => (
    <li className="flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-coral-light text-coral-deep">{icon}</span>
      <span>{body}</span>
    </li>
  )

  return (
    <>
      <button
        onClick={onClick}
        className="flex h-10 items-center gap-1.5 rounded-full bg-coral px-3 text-[13px] font-medium text-white shadow-btn-coral"
        aria-label="Add Nira Chat to your home screen"
      >
        <Download size={15} /> <span className="hidden sm:inline">Install app</span><span className="sm:hidden">Install</span>
      </button>

      {sheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={() => setSheet(false)}>
          <div
            className="w-full max-w-sm rounded-t-3xl p-6 sm:rounded-3xl"
            style={{ backgroundColor: 'var(--bg-card)' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Add Nira Chat to your home screen"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/chat-icon-192.png" alt="" className="h-12 w-12 rounded-xl" />
                <div>
                  <p className="text-[16px] font-medium" style={text1}>Nira Chat app</p>
                  <p className="text-[13px]" style={text2}>Opens straight into your chat — separate from Nira Business</p>
                </div>
              </div>
              <button onClick={() => setSheet(false)} className="rounded-full p-1" style={text2} aria-label="Close"><X size={18} /></button>
            </div>

            {mode === 'move' ? (
              <>
                <p className="mt-5 text-[14px]" style={text1}>
                  Nira Chat installs from its own page. Your conversation comes with you.
                </p>
                <a
                  href={chatAppUrl()}
                  className="btn-press mt-4 flex h-12 items-center justify-center rounded-xl bg-coral text-[15px] font-medium text-white"
                >
                  Continue to install
                </a>
                <p className="mt-3 text-center text-[12px]" style={text2}>Then tap <strong className="font-medium">Install</strong> there</p>
              </>
            ) : (
              <ol className="mt-5 space-y-3 text-[14px]" style={text1}>
                {mode === 'ios' ? (
                  <>
                    {step(<Share size={16} />, <>Tap <strong className="font-medium">Share</strong> in Safari’s toolbar</>)}
                    {step(<SquarePlus size={16} />, <>Choose <strong className="font-medium">Add to Home Screen</strong>, then <strong className="font-medium">Add</strong></>)}
                  </>
                ) : (
                  <>
                    {step(<MoreVertical size={16} />, <>Tap the <strong className="font-medium">⋮ menu</strong> in Chrome</>)}
                    {step(<SquarePlus size={16} />, <>Choose <strong className="font-medium">Add to Home screen</strong> (or <strong className="font-medium">Install app</strong>), then <strong className="font-medium">Install</strong></>)}
                  </>
                )}
              </ol>
            )}
          </div>
        </div>
      )}
    </>
  )
}
