"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  ChevronDown,
  Plus,
  Check,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn, getInitials } from "@/lib/utils";
import NiraWordmark from "@/components/NiraWordmark";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, businessTypes: ["salon_spa", "cosmetic_shop"] },
  { href: "/bookings", label: "Bookings", icon: Calendar, businessTypes: ["salon_spa"] },
  { href: "/services", label: "Services", icon: Scissors, businessTypes: ["salon_spa"] },
  { href: "/products", label: "Products", icon: Package, businessTypes: ["salon_spa", "cosmetic_shop"] },
  { href: "/orders", label: "Orders", icon: ShoppingBag, businessTypes: ["salon_spa", "cosmetic_shop"] },
  { href: "/customers", label: "Customers", icon: Users, businessTypes: ["salon_spa", "cosmetic_shop"] },
  { href: "/analytics", label: "Analytics", icon: BarChart3, businessTypes: ["salon_spa", "cosmetic_shop"] },
  { href: "/marketing", label: "Marketing", icon: Megaphone, businessTypes: ["salon_spa", "cosmetic_shop"] },
  { href: "/marketplace", label: "Marketplace", icon: Globe, businessTypes: ["salon_spa", "cosmetic_shop"] },
  { href: "/settings", label: "Settings", icon: Settings, businessTypes: ["salon_spa", "cosmetic_shop"] },
];

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, business, businesses, switchBusiness, logout } = useAuth();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) setSwitcherOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const items = NAV_ITEMS.filter((item) => !business || item.businessTypes.includes(business.type));

  return (
    <aside
      className={cn(
        "bg-charcoal h-screen sticky top-0 flex flex-col shrink-0 transition-all duration-200",
        collapsed ? "w-[76px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="h-16 px-6 flex items-center gap-2 border-b border-white/10 shrink-0">
        {collapsed ? (
          <span className="font-serif text-coral text-2xl">N</span>
        ) : (
          <>
            <NiraWordmark size="sm" variant="white" />
            <span className="text-[9px] font-medium text-coral bg-coral/15 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
              Business
            </span>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto no-scrollbar">
        {!collapsed && (
          <div className="text-[10px] uppercase tracking-widest text-white/30 px-3 mb-2 font-medium">Workspace</div>
        )}
        <div className="space-y-0.5">
          {items.map((item) => {
            const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-medium transition-colors relative",
                  active
                    ? "bg-coral/15 text-coral border-l-[3px] border-coral -ml-[3px] pl-[15px] rounded-l-none"
                    : "text-white/55 hover:bg-white/[0.08] hover:text-white/80"
                )}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Business switcher */}
      <div className="px-3 py-3 border-t border-white/10 relative" ref={switcherRef}>
        <button
          onClick={() => setSwitcherOpen((v) => !v)}
          className="w-full flex items-center gap-2.5 px-1 py-1.5 rounded-lg hover:bg-white/[0.08] transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center text-white text-[13px] font-medium shrink-0">
            {getInitials(business?.name)}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-[13px] text-white font-medium truncate">{business?.name || "…"}</div>
              </div>
              {businesses.length > 1 && <ChevronDown size={14} className="text-white/50 shrink-0" />}
            </>
          )}
        </button>

        {switcherOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-lg shadow-card-hover border border-slate-100 py-1.5 z-50">
            {businesses.map((b) => (
              <button
                key={b.id}
                onClick={async () => {
                  setSwitcherOpen(false);
                  if (!b.is_active_business) await switchBusiness(b.id);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-page text-left"
              >
                <div className="w-7 h-7 rounded-full bg-lavender flex items-center justify-center text-white text-[11px] font-medium shrink-0">
                  {getInitials(b.name)}
                </div>
                <span className="flex-1 text-[13px] text-charcoal truncate">{b.name}</span>
                {b.is_active_business && <Check size={14} className="text-mint-deep shrink-0" />}
              </button>
            ))}
            <div className="h-px bg-slate-100 my-1.5" />
            <button
              onClick={() => {
                setSwitcherOpen(false);
                router.push("/add-business");
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-page text-left text-coral"
            >
              <Plus size={16} />
              <span className="text-[13px] font-medium">Add business</span>
            </button>
          </div>
        )}
      </div>

      {/* User */}
      <div className="px-3 py-3 border-t border-white/10 relative" ref={userRef}>
        <button
          onClick={() => setUserMenuOpen((v) => !v)}
          className="w-full flex items-center gap-2.5 px-1 py-1 rounded-lg hover:bg-white/[0.08] transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-[13px] font-medium shrink-0">
            {getInitials(user?.full_name)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 text-left">
              <div className="text-[13px] text-white truncate">{user?.full_name || "…"}</div>
              <div className="text-[11px] text-white/50 truncate">{user?.email || ""}</div>
            </div>
          )}
          {!collapsed && (
            <LogOut
              size={15}
              className="text-white/0 group-hover:text-white/60 transition-colors shrink-0"
            />
          )}
        </button>

        {userMenuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-lg shadow-card-hover border border-slate-100 py-1.5 z-50">
            <Link href="/settings" className="block px-3 py-2 text-[13px] text-charcoal hover:bg-page">
              Settings
            </Link>
            <button onClick={logout} className="w-full text-left px-3 py-2 text-[13px] text-coral hover:bg-page">
              Log out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
