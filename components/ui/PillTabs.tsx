"use client";
import { cn } from "@/lib/utils";

interface PillTabsProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function PillTabs<T extends string>({ options, value, onChange, className }: PillTabsProps<T>) {
  return (
    <div className={cn("inline-flex items-center gap-1 bg-page rounded-lg p-1 border border-slate-100", className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors whitespace-nowrap",
            value === opt.value ? "bg-charcoal text-white" : "text-slate-500 hover:text-charcoal"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
