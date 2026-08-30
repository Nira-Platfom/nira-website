import { cn } from "@/lib/utils";

interface BadgeProps {
  status: string;
  className?: string;
}

const STYLES: Record<string, string> = {
  pending: "bg-amber-light text-amber-deep",
  awaiting: "bg-amber-light text-amber-deep",
  unpaid: "bg-amber-light text-amber-deep",
  confirmed: "bg-lavender-light text-lavender-deep",
  preparing: "bg-lavender-light text-lavender-deep",
  out_for_delivery: "bg-lavender-light text-lavender-deep",
  trialing: "bg-lavender-light text-lavender-deep",
  completed: "bg-mint-light text-mint-deep",
  delivered: "bg-mint-light text-mint-deep",
  active: "bg-mint-light text-mint-deep",
  paid: "bg-mint-light text-mint-deep",
  cancelled: "bg-slate-100 text-slate-600",
  draft: "bg-slate-100 text-slate-600",
  no_show: "bg-coral-light text-coral-deep",
  past_due: "bg-coral-light text-coral-deep",
  failed: "bg-coral-light text-coral-deep",
  refunded: "bg-slate-100 text-slate-600",
};

function labelize(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Badge({ status, className }: BadgeProps) {
  const key = status?.toLowerCase() ?? "";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
        STYLES[key] || "bg-slate-100 text-slate-600",
        className
      )}
    >
      {labelize(status ?? "")}
    </span>
  );
}
