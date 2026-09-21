"use client";
import { HTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  noPadding?: boolean;
  title?: string;
  action?: ReactNode;
  /** Skip the mount-in animation — for a card inside something that
   * already animates as a whole (e.g. a StaggerItem/modal), where a
   * second, independent animation would fight the parent's. */
  noAnimate?: boolean;
}

export default function Card({ children, className, noPadding, title, action, noAnimate, ...props }: CardProps) {
  const content = (
    <>
      {(title || action) && (
        <div className={cn("flex items-center justify-between", noPadding ? "p-6 pb-0" : "mb-5")}>
          {title && <h3 className="text-[15px] font-medium text-charcoal">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </>
  );

  const classes = cn(
    "bg-white rounded-card shadow-card border border-slate-100 transition-shadow duration-200 hover:shadow-card-hover",
    noPadding ? "p-0" : "p-6",
    className
  );

  if (noAnimate) {
    return (
      <div className={classes} {...(props as HTMLAttributes<HTMLDivElement>)}>
        {content}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={classes}
      {...(props as any)}
    >
      {content}
    </motion.div>
  );
}
