'use client'

import { motion } from 'framer-motion'

// Re-mounted by Next.js on every navigation, so this replays automatically
// each time the route changes, a soft fade + rise instead of a hard cut.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}
