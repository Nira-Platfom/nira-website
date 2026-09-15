"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Megaphone,
  Globe,
  Settings,
  MoreHorizontal,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: any };

const PRIMARY: Record<"salon_spa" | "cosmetic_shop", NavItem[]> = {
  salon_spa: [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/bookings", label: "Bookings", icon: Calendar },
    { href: "/services", label: "Services", icon: Scissors },
    { href: "/customers", label: "Customers", icon: Users },
  ],
  cosmetic_shop: [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/products", label: "Products", icon: Package },
    { href: "/orders", label: "Orders", icon: ShoppingBag },
    { href: "/customers", label: "Customers", icon: Users },
  ],
};

// Mirrors the native app's "More" screen (see mobile design system §9.6):
// whichever of Products/Orders isn't already a primary tab lives here too,
// alongside the screens that aren't frequent enough to earn a tab slot.
const MORE: Record<"salon_spa" | "cosmetic_shop", NavItem[]> = {
  salon_spa: [
    { href: "/products", label: "Products", icon: Package },
    { href: "/orders", label: "Orders", icon: ShoppingBag },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/marketing", label: "Marketing", icon: Megaphone },
    { href: "/marketplace", label: "Marketplace", icon: Globe },
    { href: "/settings", label: "Settings", icon: Settings },
  ],
  cosmetic_shop: [
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/marketing", label: "Marketing", icon: Megaphone },
    { href: "/marketplace", label: "Marketplace", icon: Globe },
    { href: "/settings", label: "Settings", icon: Settings },
  ],
};

export default function MobileTabBar() {
  const pathname = usePathname();
  const { business, logout } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);

  const type = business?.type === "salon_spa" ? "salon_spa" : "cosmetic_shop";
  const primary = PRIMARY[type];
  const more = MORE[type];
  const moreActive = more.some((item) => pathname.startsWith(item.href));

  return (
    <>
      {/* Bottom tab bar — mobile/tablet only, the desktop sidebar takes over at lg+ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex items-stretch"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {primary.map((item) => {
          const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[52px]"
            >
              <Icon size={20} className={active ? "text-coral" : "text-slate-400"} />
              <span className={cn("text-[10px] font-medium", active ? "text-coral" : "text-slate-400")}>
                {item.label}
              </span>
            </Link>
          );
        })}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[52px]"
        >
          <MoreHorizontal size={20} className={moreActive ? "text-coral" : "text-slate-400"} />
          <span className={cn("text-[10px] font-medium", moreActive ? "text-coral" : "text-slate-400")}>More</span>
        </button>
      </nav>

      {/* More sheet */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMoreOpen(false)} />
          <div
            className="relative w-full bg-white rounded-t-2xl overflow-hidden animate-sheet-up"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-[15px] font-medium text-charcoal">More</span>
              <button onClick={() => setMoreOpen(false)} className="p-1.5 -mr-1.5 text-slate-400">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1 px-3 py-3">
              {more.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl hover:bg-page transition-colors"
                  >
                    <div className="w-11 h-11 rounded-full bg-lavender-light text-lavender-deep flex items-center justify-center">
                      <Icon size={19} />
                    </div>
                    <span className="text-[12px] font-medium text-charcoal">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="h-px bg-slate-100 mx-3" />
            <button
              onClick={() => {
                setMoreOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-5 py-4 text-coral"
            >
              <LogOut size={18} />
              <span className="text-[14px] font-medium">Log out</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
