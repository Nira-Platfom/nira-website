"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Bell, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials, cn } from "@/lib/utils";

const TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/bookings": "Bookings",
  "/services": "Services",
  "/products": "Products",
  "/orders": "Orders",
  "/customers": "Customers",
  "/analytics": "Analytics",
  "/marketing": "Marketing",
  "/marketplace": "Marketplace",
  "/settings": "Settings",
  "/subscription": "Subscription",
  "/team": "Team",
  "/add-business": "Add business",
};

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const { business } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const title = useMemo(() => {
    const key = Object.keys(TITLES).find((k) => (k === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(k)));
    return key ? TITLES[key] : "Nira";
  }, [pathname]);

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center px-4 md:px-6 shrink-0">
      <button onClick={onMenuClick} className="md:hidden mr-3 text-charcoal">
        <Menu size={22} />
      </button>

      <h1 className="text-[18px] font-medium text-charcoal shrink-0">{title}</h1>

      <div className="flex-1 flex justify-center px-6">
        <div className="hidden md:flex items-center w-full max-w-[400px] h-10 bg-page border border-slate-200 rounded-input px-3 text-slate-400">
          <Search size={16} className="mr-2 shrink-0" />
          <span className="text-sm flex-1 truncate">Search customers, orders, products…</span>
          <kbd className="text-[11px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-400">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-page transition-colors">
          <Bell size={18} />
        </button>

        {business && (
          <span
            className={cn(
              "hidden sm:inline-flex text-[11px] font-medium px-2.5 py-1 rounded-full",
              business.type === "salon_spa" ? "bg-lavender-light text-lavender-deep" : "bg-coral-light text-coral-deep"
            )}
          >
            {business.type === "salon_spa" ? "Salon & Spa" : "Cosmetic Shop"}
          </span>
        )}

        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-9 h-9 rounded-full bg-charcoal text-white flex items-center justify-center text-[13px] font-medium"
          >
            {getInitials(business?.name)}
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-card-hover border border-slate-100 py-1.5 z-50">
              <Link href="/settings" className="block px-3 py-2 text-[13px] text-charcoal hover:bg-page">
                Profile
              </Link>
              <Link href="/settings" className="block px-3 py-2 text-[13px] text-charcoal hover:bg-page">
                Settings
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
