import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'

// The customer chat is its own installable app ("Nira Chat"), separate from
// the business dashboard app ("Nira Business", /site.webmanifest): adding
// THIS page to a home screen opens straight into the chat, nothing else.
// No marketing navbar/footer here — NiraAgentChat renders its own slim
// header and a one-line footer under the composer.
const baseMetadata: Metadata = {
  applicationName: 'Nira Chat',
  appleWebApp: { capable: true, title: 'Nira Chat', statusBarStyle: 'default' },
  icons: {
    icon: [
      { url: '/chat-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/chat-apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

// On chat.beautynira.com the chat app owns the whole origin (scope "/");
// on www it's scoped to /chat (kept so existing links still work).
export function generateMetadata(): Metadata {
  const host = (headers().get('host') || '').toLowerCase()
  return { ...baseMetadata, manifest: host.startsWith('chat.') ? '/chat-app.webmanifest' : '/chat.webmanifest' }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F7FF' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  viewportFit: 'cover',
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="h-[100dvh] overflow-hidden"
      style={{ backgroundColor: 'var(--bg-page)', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {children}
    </main>
  )
}
