"use client";
import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PillTabsProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function PillTabs<T extends string>({ options, value, onChange, className }: PillTabsProps<T>) {
  // Unique per mounted instance — a page can have more than one PillTabs
  // (e.g. Analytics' period selector and the revenue chart's own range
  // pills) and a shared layoutId string would make framer-motion treat
  // them as the SAME sliding highlight, jumping between the two instead
  // of staying within each one.
  const groupId = useId();

  return (
    <div className={cn("inline-flex items-center gap-1 bg-page rounded-lg p-1 border border-slate-100", className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "relative px-3 py-1.5 rounded-md text-[13px] font-medium whitespace-nowrap transition-colors",
            value === opt.value ? "text-white" : "text-slate-500 hover:text-charcoal"
          )}
        >
          {value === opt.value && (
            <motion.span
              layoutId={`pill-tabs-active-${groupId}`}
              className="absolute inset-0 bg-charcoal rounded-md"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
