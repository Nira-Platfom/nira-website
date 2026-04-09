'use client'

import { useState, useEffect, useRef } from 'react'

const images = [
  {
    src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    label: 'Salon & Spa',
    name: 'Grace Beauty Salon',
    stat: '4.9',
    statLabel: 'Rating',
    kenBurns: 'ken-burns',
  },
  {
    src: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
    label: 'Skincare Shop',
    name: 'Zara Skincare Store',
    stat: '312',
    statLabel: 'Products',
    kenBurns: 'ken-burns-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80',
    label: 'Beauty Studio',
    name: 'Amina Beauty Studio',
    stat: '98%',
    statLabel: 'Satisfaction',
    kenBurns: 'ken-burns-3',
  },
  {
    src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
    label: 'Nail Lounge',
    name: 'Naomi Nail Lounge',
    stat: '24/7',
    statLabel: 'Available',
    kenBurns: 'ken-burns',
  },
  {
    src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    label: 'Hair Salon',
    name: 'Fatuma Hair Salon',
    stat: '127',
    statLabel: 'Bookings',
    kenBurns: 'ken-burns-2',
  },
]

export default function BeautyShowcase() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [badgeMounted, setBadgeMounted] = useState(false)
  const [contentKey, setContentKey] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  useEffect(() => {
    const t = setTimeout(() => setBadgeMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Preload next image
  useEffect(() => {
    const next = (current + 1) % images.length
    const img = new window.Image()
    img.src = images[next].src
  }, [current])

  useEffect(() => {
    if (isHovered) return
    const interval = setInterval(() => {
      goTo((current + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [current, isHovered])

  function goTo(index: number) {
    if (index === current) return
    setPrev(current)
    setIsTransitioning(true)
    setCurrent(index)
    setContentKey(k => k + 1)
    setTimeout(() => {
      setIsTransitioning(false)
      setPrev(null)
    }, 1200)
  }

  const img = images[current]

  return (
    <div style={{ position: 'relative', paddingBottom: 20 }}>

      {/* Outer glow behind image */}
      <div style={{
        position: 'absolute',
        width: 'calc(100% + 40px)',
        height: 'calc(100% + 40px)',
        top: -20,
        left: -20,
        borderRadius: 32,
        background: 'radial-gradient(ellipse at 60% 40%, rgba(255,107,107,0.20) 0%, rgba(184,169,224,0.12) 50%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'outer-glow-breathe 5s ease-in-out infinite',
      }} />

      {/* Main image container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(360px, 50vw, 560px)',
          borderRadius: 24,
          overflow: 'hidden',
          cursor: 'default',
          zIndex: 1,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          touchEndX.current = e.changedTouches[0].clientX
          const delta = touchEndX.current - touchStartX.current
          if (delta < -50) goTo((current + 1) % images.length)
          else if (delta > 50) goTo((current - 1 + images.length) % images.length)
        }}
      >

        {/* Images */}
        {images.map((image, i) => {
          const isActive = i === current
          const isLeaving = i === prev && isTransitioning
          return (
            <img
              key={i}
              src={image.src}
              alt={image.label}
              loading={i === 0 ? 'eager' : 'lazy'}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              className={isActive ? image.kenBurns + '-active' : ''}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: 'inherit',
                opacity: isActive ? 1 : isLeaving ? 0 : 0,
                transform: isActive ? 'scale(1.0)' : 'scale(1.0)',
                transition: 'opacity 1200ms ease-in-out',
                willChange: 'transform, opacity',
                animation: isActive ? `${image.kenBurns} 6s ease-out forwards` : undefined,
              }}
            />
          )
        })}

        {/* Color overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(255,107,107,0.15) 0%, rgba(0,0,0,0.0) 40%, rgba(30,41,59,0.45) 100%)',
        }} />

        {/* Corner accent — top right */}
        <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 2, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 16, right: 0, width: 48, height: 2, background: 'rgba(255,255,255,0.6)' }} />
          <div style={{ position: 'absolute', top: 16, right: 0, width: 2, height: 48, background: 'rgba(255,255,255,0.6)' }} />
        </div>

        {/* Corner accent — bottom left */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 2, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', bottom: 16, left: 0, width: 48, height: 2, background: 'rgba(255,255,255,0.6)' }} />
          <div style={{ position: 'absolute', bottom: 16, left: 0, width: 2, height: 48, background: 'rgba(255,255,255,0.6)' }} />
        </div>

        {/* Top-left badge */}
        <div
          key={`badge-${current}`}
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 999,
            padding: '8px 16px',
            animation: 'content-fade-up 600ms ease-out both',
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF6B6B', flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: 'white' }}>{img.label}</span>
        </div>

        {/* Pause indicator */}
        {isHovered && (
          <div style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 999,
            padding: '6px 12px',
          }}>
            <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.8)' }}>●</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Paused</span>
          </div>
        )}

        {/* Slide indicators */}
        <div style={{
          position: 'absolute',
          bottom: 110,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          display: 'flex',
          gap: 6,
          alignItems: 'center',
        }}>
          {images.map((_, i) => (
            <div
              key={i}
              onClick={() => goTo(i)}
              style={{
                cursor: 'pointer',
                width: i === current ? 24 : 6,
                height: 6,
                borderRadius: 999,
                background: i === current ? 'white' : 'rgba(255,255,255,0.5)',
                opacity: i === current ? 1 : 0.6,
                transition: 'all 300ms ease-out',
              }}
            />
          ))}
        </div>

        {/* Bottom glassmorphism card */}
        <div
          key={`card-${contentKey}`}
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            zIndex: 3,
            background: 'rgba(255,255,255,0.14)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 16,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: contentKey === 0
              ? 'fade-in-up 800ms ease-out 300ms both'
              : 'content-fade-up 500ms ease-out both',
          }}
        >
          {/* Left */}
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'white', margin: 0 }}>{img.name}</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '4px 0 0' }}>
              Bot Active · Serving customers 24/7
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#6BCFB8',
                animation: 'pulse-dot-green 2s ease-in-out infinite',
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>47 messages today</span>
            </div>
          </div>
          {/* Right */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: 28, fontFamily: 'var(--font-dm-serif)', color: 'white', margin: 0, lineHeight: 1 }}>{img.stat}</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '4px 0 0' }}>{img.statLabel}</p>
          </div>
        </div>

      </div>

      {/* Floating badge — left (Bot Active) */}
      <div style={{
        position: 'absolute',
        bottom: -16,
        left: -16,
        zIndex: 10,
        opacity: badgeMounted ? 1 : 0,
        transform: badgeMounted ? 'scale(1)' : 'scale(0.85)',
        transition: 'opacity 600ms ease-out 800ms, transform 600ms ease-out 800ms',
        animation: badgeMounted ? 'float-badge-1 4s ease-in-out infinite' : undefined,
      }}>
        <div style={{
          background: 'white',
          borderRadius: 14,
          boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
          padding: '12px 16px',
          width: 160,
          border: '1px solid #F0ECFB',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6BCFB8', animation: 'pulse-dot-green 2s ease-in-out infinite', flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#4DB8A0' }}>Bot Active</span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 500, color: '#1E293B', margin: '0 0 6px' }}>47 chats today</p>
          <div style={{ height: 5, background: '#E4F7F3', borderRadius: 999 }}>
            <div style={{ width: '75%', height: '100%', background: '#6BCFB8', borderRadius: 999 }} />
          </div>
        </div>
      </div>

      {/* Floating badge — right (New Booking) */}
      <div style={{
        position: 'absolute',
        top: 40,
        right: -16,
        zIndex: 10,
        opacity: badgeMounted ? 1 : 0,
        transform: badgeMounted ? 'scale(1)' : 'scale(0.85)',
        transition: 'opacity 600ms ease-out 1100ms, transform 600ms ease-out 1100ms',
        animation: badgeMounted ? 'float-badge-2 5s ease-in-out 1.5s infinite' : undefined,
      }}>
        <div style={{
          background: 'white',
          borderRadius: 14,
          boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
          padding: '12px 16px',
          width: 154,
          border: '1px solid #F0ECFB',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth={2}>
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#1E293B' }}>New Booking</span>
          </div>
          <p style={{ fontSize: 11, color: '#64748B', margin: '0 0 2px' }}>Classic Facial · 10AM</p>
          <p style={{ fontSize: 11, color: '#94A3B8', margin: 0, fontStyle: 'italic' }}>Amina Hassan</p>
        </div>
      </div>

    </div>
  )
}
