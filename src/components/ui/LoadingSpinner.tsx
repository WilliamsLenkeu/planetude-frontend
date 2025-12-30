import { Sparkles, Coffee, Book, Heart, PencilLine } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const TIPS = [
  "Prends une petite gorgée d'eau... 💧",
  "N'oublie pas de détendre tes épaules. ✨",
  "Ton espace de travail est ton sanctuaire. 🕯️",
  "Chaque petit pas compte vers ton succès. 🌸",
  "Respire profondément et concentre-toi. 🌿",
  "C'est le moment idéal pour un thé chaud. ☕",
  "Ton futur toi te remerciera pour tes efforts. 🎀",
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
    ? "fixed inset-0 bg-pink-milk/20 backdrop-blur-sm z-[9999] flex flex-col justify-center items-center p-6"
    : "flex flex-col justify-center items-center min-h-[40vh] gap-6 p-6 w-full"

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Cercles décoratifs */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-6 md:-inset-10 border border-dashed border-pink-candy/20 rounded-full"
        />
        
        <motion.div 
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 1, -1, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="size-20 md:size-24 bg-white rounded-3xl border-2 border-pink-milk shadow-notebook flex items-center justify-center relative z-10 overflow-hidden"
        >
          {/* Lignes de papier subtiles */}
          <div className="absolute inset-0 opacity-[0.08]" style={{ 
            backgroundImage: 'linear-gradient(var(--color-paper-line) 1px, transparent 1px)',
            backgroundSize: '100% 12px'
          }} />
          
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative"
          >
            <Coffee className="text-pink-candy/60" size={36} />
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 left-1/2 -translate-x-1/2 text-pink-candy/40"
            >
              <Sparkles size={14} />
            </motion.div>
          </motion.div>
          
          <Heart className="absolute bottom-2 right-2 text-pink-candy/30" size={10} fill="currentColor" />
        </motion.div>
        
        {/* Icônes flottantes (uniquement si pas fullScreen ou sur desktop) */}
        {!fullScreen && (
          <>
            <motion.div 
              animate={{ y: [0, 10, 0], x: [0, 5, 0] }} 
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute -top-4 -left-4 text-pink-candy/20"
            >
              <PencilLine size={20} />
            </motion.div>
            <motion.div 
              animate={{ y: [0, -8, 0], x: [0, -5, 0] }} 
              transition={{ duration: 7, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-2 -right-6 text-blue-cloud/30"
            >
              <Book size={22} />
            </motion.div>
          </>
        )}
      </div>
      
      <div className="text-center max-w-xs space-y-3">
        <div className="space-y-1">
          <p className="font-display text-xl md:text-2xl text-hello-black">
            {message || "Préparation... ✨"}
          </p>
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.4, 1],
                  backgroundColor: ['#F8C3CD', '#E0A8B1', '#F8C3CD'] 
                }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                className="w-1.5 h-1.5 rounded-full"
              />
            ))}
          </div>
        </div>

        <div className="min-h-[3rem] flex items-center justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.p 
              key={tipIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="font-serif italic text-pink-deep/40 text-xs md:text-sm leading-relaxed"
            >
              {TIPS[tipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
