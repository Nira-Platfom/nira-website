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
  title: 'Nira — Your Beauty AI Companion',
  description:
    'AI-powered WhatsApp assistant for salons, spas, and cosmetic shops in East Africa. Auto-reply, bookings, and grow your business — 24/7.',
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
