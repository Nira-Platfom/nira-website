'use client'

interface NiraWordmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  // 'mono-white': fully white wordmark (N included) — for placement directly
  // on a coral/brand-colored surface, where a coral "N" would disappear.
  variant?: 'default' | 'white' | 'mono-white'
  className?: string
}

export default function NiraWordmark({
  size = 'md',
  variant = 'default',
  className = '',
}: NiraWordmarkProps) {
  const fontSize = { sm: '22px', md: '28px', lg: '38px', xl: 'clamp(64px, 14vw, 160px)' }[size]

  const nColor   = variant === 'mono-white' ? '#FFFFFF' : '#FF6B6B'
  const iraColor = variant === 'default' ? 'var(--text-primary)' : '#FFFFFF'

  return (
    <span
      className={`inline-flex items-baseline select-none ${className}`}
      aria-label="Nira"
      style={{ lineHeight: 1 }}
    >
      <span
        style={{
          fontFamily: 'var(--font-dm-serif), "DM Serif Display", Georgia, serif',
          fontSize: fontSize,
          color: nColor,
          letterSpacing: '0.5px',
          lineHeight: 1,
        }}
      >
        N
      </span>
      <span
        style={{
          fontFamily: 'var(--font-dm-serif), "DM Serif Display", Georgia, serif',
          fontSize: fontSize,
          color: iraColor,
          letterSpacing: '0.5px',
          lineHeight: 1,
        }}
      >
        ira
      </span>
    </span>
  )
}
