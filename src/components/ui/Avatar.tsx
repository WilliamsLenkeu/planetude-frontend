import { cn } from '../../utils/cn'

interface AvatarProps {
  src?: string
  alt?: string
  initials?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Avatar = ({ src, alt, initials, size = 'md', className = '' }: AvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base'
  }

  if (src) {
    return (
      <img
        src={src}
        alt={alt || 'Avatar'}
        className={cn(sizeClasses[size], 'rounded-full object-cover border', className)}
        style={{ borderColor: 'var(--color-border)' }}
      />
    )
  }

  const displayInitials = initials || '?'

  return (
    <div
      className={cn(
        sizeClasses[size],
        'rounded-full flex items-center justify-center font-medium',
        className
      )}
      style={{
        backgroundColor: 'var(--color-bg-tertiary)',
        border: '2px solid var(--color-border)',
        color: 'var(--color-text)'
      }}
    >
      {displayInitials}
    </div>
  )
}
