import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
  variant?: 'default' | 'pink' | 'gold' | 'white'
}

export function Card({ children, className = '', variant = 'default', ...props }: CardProps) {
  const variants = {
    default: 'chic-card',
    pink: 'bg-pink-milk/10 border-2 border-pink-candy/10 shadow-sm',
    gold: 'bg-soft-gold/5 border-2 border-soft-gold/20 shadow-sm',
    white: 'bg-white border-2 border-gray-100 shadow-sm'
  }

  return (
    <motion.div
      className={`p-4 rounded-2xl relative overflow-hidden transition-all duration-500 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
