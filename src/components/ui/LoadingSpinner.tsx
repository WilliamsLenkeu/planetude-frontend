import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const TIPS = [
  "Prends une petite gorgée d'eau... 💧",
  "Détends tes épaules et respire. ✨",
  "Ton espace est ton sanctuaire. 🕯️",
  "Chaque petit pas compte. 🌸",
  "La discipline est une forme d'amour de soi. 🎀",
  "Un thé chaud et on s'y remet. ☕",
  "Organisation rime avec sérénité. 📁"
]

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message, fullScreen = false }: LoadingSpinnerProps) {
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const containerClasses = fullScreen 
    ? "fixed inset-0 z-[9999] flex flex-col justify-center items-center p-6"
    : "flex flex-col justify-center items-center min-h-[40vh] gap-12 p-6 w-full"

  return (
    <div className={containerClasses} style={fullScreen ? { backgroundColor: 'var(--color-background)' } : {}}>
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Cercles de lumière diffus - Effet Aura */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 50% 60% 40% 60%", "40% 60% 70% 30% / 40% 50% 60% 50%"]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 blur-3xl"
          style={{ backgroundColor: 'var(--color-primary)' }}
        />
        
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.15, 0.05],
            borderRadius: ["60% 40% 30% 70% / 50% 60% 40% 60%", "40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 50% 60% 40% 60%"]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute inset-4 blur-2xl"
          style={{ backgroundColor: 'var(--color-secondary, var(--color-primary))' }}
        />

        {/* Le Cœur du Loader - Orbite Minimaliste */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Anneau de progression fluide */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <motion.circle
              cx="48"
              cy="48"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="opacity-10"
              style={{ color: 'var(--color-text)' }}
            />
            <motion.circle
              cx="48"
              cy="48"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="283"
              animate={{ 
                strokeDashoffset: [283, 0, -283],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              strokeLinecap="round"
              style={{ color: 'var(--color-primary)' }}
            />
          </svg>

          {/* Noyau central évanescent */}
          <motion.div 
            animate={{ 
              scale: [0.9, 1.1, 0.9],
              opacity: [0.4, 0.8, 0.4],
              borderRadius: ["35% 65% 60% 40% / 45% 40% 60% 55%", "65% 35% 40% 60% / 40% 60% 40% 60%", "35% 65% 60% 40% / 45% 40% 60% 55%"]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-10 h-10 blur-[1px]"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
        </div>

        {/* Étoiles filantes discrètes */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              top: ["50%", `${Math.random() * 100}%`],
              left: ["50%", `${Math.random() * 100}%`],
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2, 
              repeat: Infinity, 
              delay: i * 1.2,
              ease: "easeOut" 
            }}
            className="absolute w-1 h-1 bg-white rounded-full blur-[0.5px] z-10"
          />
        ))}
      </div>

      <div className="text-center space-y-6 max-w-xs">
        <div className="space-y-2">
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40" 
            style={{ color: 'var(--color-text)' }}
          >
            {message || "Chargement"}
          </motion.div>
          <div className="h-[1px] w-12 mx-auto bg-gradient-to-r from-transparent via-text/20 to-transparent" />
        </div>
        
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="text-sm font-medium italic text-text/50 font-display"
            >
              {TIPS[tipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}


