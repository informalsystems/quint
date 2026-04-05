import Link from 'next/link'
import React from 'react'

type LinkButtonProps = {
  href: string
  variant?: 'filled' | 'outlined'
  className?: string
  onClick?: () => void
  children: React.ReactNode
}

export const LinkButton = ({ href, variant = 'filled', className = '', onClick, children }: LinkButtonProps) => {
  const base =
    'rounded-full px-5 py-[10px] text-base font-semibold tracking-[0.1em] transition-colors font-[family-name:var(--font-instrument-sans)]'

  const variants = {
    filled: 'bg-quint-dark text-white hover:opacity-90',
    outlined: 'border-1 border-quint-dark text-quint-dark hover:bg-quint-dark hover:text-white',
  }

  return (
    <Link href={href} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  )
}
