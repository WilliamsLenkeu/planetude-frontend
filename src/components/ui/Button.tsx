import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', isLoading = false, disabled, className = '', ...props }, ref) => {
    const baseClass = 'btn'
    const variantClass = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost'
    }[variant]
    const sizeClass = {
      sm: 'py-1.5 px-3 text-sm',
      md: '',
      lg: 'py-3 px-6 text-base'
    }[size]

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseClass, variantClass, sizeClass, className)}
        {...props}
      >
        {isLoading && (
          <span
            className="inline-block shrink-0 rounded-full border-2 border-[var(--color-border-light)] animate-spin"
            style={{
              width: 18,
              height: 18,
              borderTopColor: 'currentColor',
            }}
          />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
