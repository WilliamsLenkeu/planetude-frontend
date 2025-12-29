import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
  variant?: 'default' | 'pink' | 'gold' | 'white'
}

export function Card({ children, className = '', variant = 'default', ...props }: CardProps) {
  const variants = {
    default: 'bg-white border-2 border-pink-milk',
    pink: 'bg-pink-milk/30 border-2 border-pink-candy/20',
    gold: 'bg-soft-gold/10 border-2 border-soft-gold/30',
    white: 'bg-white border-4 border-pink-milk'
  }

  return (
    <motion.div
      className={`kawaii-card ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
