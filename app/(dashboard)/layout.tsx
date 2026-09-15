"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileTabBar from "@/components/layout/MobileTabBar";
import NiraWordmark from "@/components/NiraWordmark";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-page">
        <NiraWordmark size="lg" />
        <div className="w-8 h-8 border-[3px] border-slate-200 border-t-coral rounded-full animate-spin" />
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
