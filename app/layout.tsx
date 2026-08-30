import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'sonner'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500'],
})

const dmSerifDisplay = DM_Serif_Display({
  variable: '--font-dm-serif',
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Nira · Beauty Business AI Companion',
  description:
    'Nira talks with your customers on WhatsApp like a real person would, books appointments, and helps new customers discover salons, spas, and cosmetic shops across East Africa.',

  icons: {
    icon: [
      { url: '/favicon.ico',        sizes: 'any' },
      { url: '/favicon-16x16.png',  sizes: '16x16',  type: 'image/png' },
      { url: '/favicon-32x32.png',  sizes: '32x32',  type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon-32x32.png', color: '#FF6B6B' },
    ],
  },

  manifest: '/site.webmanifest',
  themeColor: '#FF6B6B',

  openGraph: {
    title: 'Nira · Beauty Business AI Companion',
    description:
      'Nira talks with your customers on WhatsApp like a real person would, books appointments, and helps new customers discover your business nearby.',
    url: 'https://nira.tz',
    siteName: 'Nira',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Nira · Beauty AI Companion' }],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Nira · Beauty Business AI Companion',
    description: 'AI-powered WhatsApp assistant for beauty businesses in East Africa.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${dmSerifDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{ classNames: { toast: 'font-sans' } }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
