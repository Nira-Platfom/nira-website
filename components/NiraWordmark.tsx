'use client'

interface NiraWordmarkProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'white'
  className?: string
}

export default function NiraWordmark({
  size = 'md',
  variant = 'default',
  className = '',
}: NiraWordmarkProps) {
  const fontSize = { sm: '22px', md: '28px', lg: '38px' }[size]

  const nColor   = '#FF6B6B'
  const iraColor = variant === 'white' ? '#FFFFFF' : '#1E293B'

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
