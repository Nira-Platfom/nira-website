import type { Metadata, Viewport } from 'next'

// The customer chat is its own installable app ("Nira Chat"), separate from
// the business dashboard app ("Nira Business", /site.webmanifest): adding
// THIS page to a home screen opens straight into the chat, nothing else.
// No marketing navbar/footer here — NiraAgentChat renders its own slim
// header and a one-line footer under the composer.
export const metadata: Metadata = {
  manifest: '/chat.webmanifest',
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
