import Link from 'next/link'

interface CineXLogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

export default function CineXLogo({ size = 'md', href = '/landing' }: CineXLogoProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  }

  return (
    <Link href={href} className={`font-black tracking-tight ${sizeClasses[size]} text-cinex-red select-none`}>
      CINE<span className="text-white">X</span>
    </Link>
  )
}
