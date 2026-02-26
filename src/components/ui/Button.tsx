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
          <span className="inline-flex items-end justify-center gap-0.5 shrink-0 h-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="loader-wavy-bar-sm"
                style={{
                  height: 14,
                  background: 'currentColor',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </span>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
