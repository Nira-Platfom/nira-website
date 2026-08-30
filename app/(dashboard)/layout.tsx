"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import NiraWordmark from "@/components/NiraWordmark";
import { X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
      {/* Desktop sidebar */}
      <div className="hidden lg:block xl:hidden">
        <Sidebar collapsed />
      </div>
      <div className="hidden xl:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} />
          <div className="relative">
            <Sidebar />
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-4 -right-11 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
