

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
    lg: 'w-12 h-12 text-base'
  }

  if (src) {
    return (
      <img
        src={src}
        alt={alt || 'Avatar'}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-[var(--color-border-light)] ${className}`}
      />
    )
  }

  const displayInitials = initials || '?'

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-light)] flex items-center justify-center font-medium text-[var(--color-text-primary)] ${className}`}
    >
      {displayInitials}
    </div>
  )
}
