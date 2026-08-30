"use client";
import { motion } from "framer-motion";

// Re-mounted by Next.js on every navigation within the dashboard — a quick,
// snappy fade+rise (not the marketing site's slower one) so switching
// between Bookings/Orders/etc. still feels immediate for a daily tool.
export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
