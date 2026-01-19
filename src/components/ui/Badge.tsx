import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'primary' | 'success' | 'warning' | 'error'
  className?: string
}

export const Badge = ({ children, variant = 'primary', className = '' }: BadgeProps) => {
  const variantClass = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error'
  }[variant]

  return (
    <span className={`badge ${variantClass} ${className}`}>
      {children}
    </span>
  )
}
