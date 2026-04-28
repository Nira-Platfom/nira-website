import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ThemeProvider } from 'next-themes'
import CursorGlow from '../components/CursorGlow'
import ScrollProgress from '../components/ScrollProgress'
import ThemeToggle from '../components/ThemeToggle'

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
  title: 'Nira — Beauty Business AI Companion',
  description:
    'AI-powered WhatsApp assistant for salons, spas, and cosmetic shops in East Africa. Automate bookings, orders and customer service — 24/7.',

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
    title: 'Nira — Beauty Business AI Companion',
    description:
      'AI-powered WhatsApp assistant for salons, spas, and cosmetic shops in East Africa. Auto-reply, bookings, and grow your business — 24/7.',
    url: 'https://nira.tz',
    siteName: 'Nira',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Nira — Beauty AI Companion' }],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Nira — Beauty Business AI Companion',
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
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <ScrollProgress />
          <CursorGlow />
          {/* Theme toggle — floats at top-right, z-index above navbar */}
          <div
            className="fixed z-[60] hidden md:flex items-center justify-center"
            style={{ top: 12, right: 16 }}
          >
            <ThemeToggle />
          </div>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
