import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/** Marks a booking/order the Nira agent brought in — the only ones that
 * count toward Nira's commission. Shows the shared reference (NR-XXXXXX)
 * the customer was given, so both sides can point at the same transaction. */
export default function NiraSourceBadge({
  source,
  niraRef,
  className,
}: {
  source?: string | null;
  niraRef?: string | null;
  className?: string;
}) {
  if (source !== "nira_agent") return null;
  return (
    <span
      title="Brought in by the Nira agent"
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-coral-light px-2 py-0.5 text-[11px] font-medium text-coral-deep whitespace-nowrap",
        className
      )}
    >
      <Sparkles size={11} /> via Nira{niraRef ? ` · ${niraRef}` : ""}
    </span>
  );
}
