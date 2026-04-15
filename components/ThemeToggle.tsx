'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: isDark ? '#253347' : '#F1F0F9',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.15 }}
    >
      <motion.span
        key={isDark ? 'moon' : 'sun'}
        initial={{ rotate: -180, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isDark ? (
          // Moon icon
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          // Sun icon
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </motion.span>
    </motion.button>
  )
}
