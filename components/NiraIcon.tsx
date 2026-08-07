interface NiraIconProps {
  size?: number
  variant?: 'coral' | 'white'
  className?: string
}

const SRC = {
  coral: '/brand/nira-icon-coral.png',
  white: '/brand/nira-icon-white.png',
}

export default function NiraIcon({
  size = 28,
  variant = 'coral',
  className = '',
}: NiraIconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SRC[variant]}
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain', flexShrink: 0 }}
    />
  )
}
