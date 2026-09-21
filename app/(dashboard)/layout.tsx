"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileTabBar from "@/components/layout/MobileTabBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-6 bg-page">
        {/* Real brand mark (a static PNG, not the CSS-drawn wordmark) — this
            screen can render before the theme/CSS-variable system has
            settled, which previously left the "ira" half of the wordmark
            invisible (its color came from a CSS var that wasn't resolved
            yet). An image's colors are baked in, so there's nothing to
            fail to resolve; text-charcoal below is a fixed Tailwind color
            for the same reason, not the CSS-var-driven text-primary. */}
        <div className="flex flex-col items-center gap-3 animate-nira-fade-up">
          <img
            src="/brand/nira-icon-coral.png"
            alt="Nira"
            width={72}
            height={72}
            className="w-[72px] h-[72px] animate-nira-breathe drop-shadow-[0_8px_20px_rgba(255,107,107,0.25)]"
          />
          <span className="font-serif text-[26px] text-charcoal tracking-tight">Nira</span>
        </div>
        <div
          className="w-7 h-7 border-[3px] border-slate-200 border-t-coral rounded-full animate-spin animate-nira-fade-up"
          style={{ animationDelay: "150ms" }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-page overflow-hidden">
      {/* Desktop sidebar — mobile/tablet gets the bottom tab bar instead */}
      <div className="hidden lg:block xl:hidden">
        <Sidebar collapsed />
      </div>
      <div className="hidden xl:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {/* Bottom padding on mobile clears the fixed tab bar (52px content
              + its own safe-area inset) so the last card is never hidden
              behind it; lg+ has no tab bar so no extra padding is needed. */}
          <div className="p-4 md:p-6 pb-24 lg:pb-6 max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>

      <MobileTabBar />
    </div>
  );
}
