import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-h-[90dvh] sm:max-h-[85vh] flex flex-col surface shadow-xl rounded-t-2xl sm:rounded-[var(--radius-md)] max-w-md sm:max-w-lg md:max-w-xl pb-safe"
          >
            {title && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[var(--color-border)] shrink-0">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg transition-colors hover:bg-[var(--color-bg-tertiary)]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="px-4 sm:px-6 py-5 overflow-y-auto overscroll-contain flex-1 min-h-0">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
