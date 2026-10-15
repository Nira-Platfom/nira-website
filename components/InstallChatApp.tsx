'use client'

import { useEffect, useState } from 'react'
import { Download, Share, SquarePlus, X } from 'lucide-react'

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

const text1 = { color: 'var(--text-primary)' }
const text2 = { color: 'var(--text-muted)' }

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

/** "Install" for the Nira Chat home-screen app (manifest: /chat.webmanifest).
 * Android/desktop Chrome: the browser's own install prompt. iPhone/iPad:
 * Safari has no install prompt, so show the two-step Share → Add to Home
 * Screen guide. Hidden once running as the installed app. */
export default function InstallChatApp() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [ios, setIos] = useState(false)
  const [installed, setInstalled] = useState(true)
  const [guide, setGuide] = useState(false)

  useEffect(() => {
    setInstalled(isStandalone())
    setIos(isIOS())
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/chat-sw.js', { scope: '/chat' }).catch(() => {})
    }
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (installed || (!deferred && !ios)) return null

  const install = async () => {
    if (deferred) {
      await deferred.prompt()
      await deferred.userChoice.catch(() => null)
      setDeferred(null)
    } else {
      setGuide(true)
    }
  }

  return (
    <>
      <button
        onClick={install}
        className="flex h-10 items-center gap-1.5 rounded-full bg-coral px-3 text-[13px] font-medium text-white shadow-btn-coral"
        aria-label="Install Nira Chat on your home screen"
      >
        <Download size={15} /> <span className="hidden sm:inline">Install app</span><span className="sm:hidden">Install</span>
      </button>
      {guide && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={() => setGuide(false)}>
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
                  <p className="text-[16px] font-medium" style={text1}>Add Nira Chat</p>
                  <p className="text-[13px]" style={text2}>Open it like an app, straight from your home screen</p>
                </div>
              </div>
              <button onClick={() => setGuide(false)} className="rounded-full p-1" style={text2} aria-label="Close"><X size={18} /></button>
            </div>
            <ol className="mt-5 space-y-3 text-[14px]" style={text1}>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral-light text-coral-deep"><Share size={16} /></span>
                Tap <strong className="font-medium">Share</strong> in Safari’s toolbar
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral-light text-coral-deep"><SquarePlus size={16} /></span>
                Choose <strong className="font-medium">Add to Home Screen</strong>, then <strong className="font-medium">Add</strong>
              </li>
            </ol>
          </div>
        </div>
      )}
    </>
  )
}
