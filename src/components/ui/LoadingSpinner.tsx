import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  fullScreen?: boolean
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = { sm: 20, md: 32, lg: 48 }

export const LoadingSpinner = ({
  fullScreen = false,
  label = 'Chargement...',
  size: sizeProp,
}: LoadingSpinnerProps) => {
  const size = sizeProp ?? (fullScreen ? 'lg' : 'md')
  const px = SIZES[size]

  const spinner = (
    <div
      className="rounded-full border-2 border-[var(--color-border-light)] animate-spin"
      style={{
        width: px,
        height: px,
        borderTopColor: 'var(--color-primary, var(--color-accent))',
      }}
    />
  )

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-background, var(--color-bg-secondary)) 94%, transparent)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {spinner}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-sm font-medium tracking-wide"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {label}
        </motion.p>
      </motion.div>
    )
  }

  return spinner
}
