'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }
    const leave = () => setVisible(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseleave', leave)
    }
  }, [])

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] hidden md:block"
      animate={{
        x: position.x - 200,
        y: position.y - 200,
        opacity: visible ? 1 : 0,
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      style={{
        width: 400,
        height: 400,
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(255,107,107,0.06) 0%, transparent 70%)',
      }}
    />
  )
}
