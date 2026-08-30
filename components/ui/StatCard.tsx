import { LucideIcon, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: { pct: string; direction: "up" | "down" | "neutral" };
  icon: LucideIcon;
  color?: "coral" | "lavender" | "mint" | "amber";
  loading?: boolean;
}

const borderColor = {
  coral: "border-l-coral",
  lavender: "border-l-lavender",
  mint: "border-l-mint",
  amber: "border-l-amber",
};

const iconBg = {
  coral: "bg-coral-light text-coral",
  lavender: "bg-lavender-light text-lavender-deep",
  mint: "bg-mint-light text-mint-deep",
  amber: "bg-amber-light text-amber-deep",
};

const trendStyle = {
  up: "text-mint-deep",
  down: "text-coral",
  neutral: "text-slate-500",
};

const TrendIcon = { up: ArrowUp, down: ArrowDown, neutral: Minus };

export default function StatCard({ label, value, sub, trend, icon: Icon, color = "coral", loading }: StatCardProps) {
  if (loading) {
    return (
      <div className={cn("bg-white rounded-card shadow-card border border-slate-100 border-l-4 p-6", borderColor[color])}>
        <div className="h-3 w-20 rounded shimmer animate-dash-shimmer mb-4" />
        <div className="h-8 w-28 rounded shimmer animate-dash-shimmer mb-2" />
        <div className="h-3 w-16 rounded shimmer animate-dash-shimmer" />
      </div>
    );
  }

  const TrendI = trend ? TrendIcon[trend.direction] : null;

  return (
    <div
      className={cn(
        "bg-white rounded-card shadow-card border border-slate-100 border-l-4 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover",
        borderColor[color]
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[12px] uppercase tracking-wide text-slate-500 font-medium">{label}</span>
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", iconBg[color])}>
          <Icon size={20} />
        </div>
      </div>
      <div className="font-serif text-[32px] leading-tight text-charcoal">{value}</div>
      {sub && <div className="text-[12px] text-slate-400 mt-1">{sub}</div>}
      {trend && TrendI && (
        <div className={cn("flex items-center gap-1 mt-2 text-[12px] font-medium", trendStyle[trend.direction])}>
          <TrendI size={14} />
          <span>{trend.pct}% vs last period</span>
        </div>
      )}
    </div>
  );
}
