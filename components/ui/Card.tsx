import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  noPadding?: boolean;
  title?: string;
  action?: ReactNode;
}

export default function Card({ children, className, noPadding, title, action, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-card shadow-card border border-slate-100 transition-shadow duration-200 hover:shadow-card-hover",
        noPadding ? "p-0" : "p-6",
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className={cn("flex items-center justify-between", noPadding ? "p-6 pb-0" : "mb-5")}>
          {title && <h3 className="text-[15px] font-medium text-charcoal">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
