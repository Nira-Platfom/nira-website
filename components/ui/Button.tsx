"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const variants = {
  primary: "bg-coral text-white hover:shadow-btn-coral hover:-translate-y-px disabled:bg-coral/50 disabled:translate-y-0 disabled:shadow-none",
  secondary: "bg-white border-[1.5px] border-coral text-coral hover:bg-coral-light",
  ghost: "bg-transparent text-slate-500 hover:bg-page",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const sizes = {
  sm: "h-9 text-[13px] px-3 gap-1.5",
  md: "h-11 text-sm px-4 gap-2",
  lg: "h-[52px] text-[15px] px-6 gap-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "btn-press inline-flex items-center justify-center rounded-btn font-medium transition-all duration-150 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : icon}
      {children}
    </button>
  );
}
