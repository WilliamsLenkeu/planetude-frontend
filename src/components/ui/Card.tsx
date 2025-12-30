import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
  variant?: 'default' | 'pink' | 'gold' | 'white'
}

export function Card({ children, className = '', variant = 'default', ...props }: CardProps) {
  const variants = {
    default: 'notebook-page border-l-4 border-pink-candy',
    pink: 'notebook-page border-l-4 border-pink-candy bg-pink-milk/5',
    gold: 'notebook-page border-l-4 border-soft-gold bg-soft-gold/5',
    white: 'notebook-page border-l-4 border-white'
  }

  return (
    <motion.div
      className={`p-6 ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Subtle Paper Clip for some variants */}
      {(variant === 'pink' || variant === 'gold') && (
        <div className="absolute -top-3 right-8 w-6 h-10 bg-gray-300/30 rounded-full border-2 border-gray-400/20 z-10" />
      )}
      {children}
    </motion.div>
  )
}
