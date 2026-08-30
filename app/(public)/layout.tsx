import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CursorGlow from '@/components/CursorGlow'
import ScrollProgress from '@/components/ScrollProgress'
import ThemeToggle from '@/components/ThemeToggle'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'

// Marketing + consumer chrome (Navbar, Footer, theme toggle, WhatsApp bubble).
// Scoped to this group only — (auth) and (dashboard) render their own shells.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <CursorGlow />
      <div
        className="fixed z-[60] hidden md:flex items-center justify-center"
        style={{ top: 12, right: 16 }}
      >
        <ThemeToggle />
      </div>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
