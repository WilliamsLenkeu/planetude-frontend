import { Star, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] gap-6">
      <div className="relative">
        {/* Cercles décoratifs rotatifs */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 border-2 border-dashed border-pink-candy/30 rounded-full"
        />
        
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="w-20 h-20 bg-white rounded-full border-4 border-pink-milk shadow-notebook flex items-center justify-center relative z-10"
        >
          <Star className="text-pink-candy fill-pink-candy" size={32} />
          
          {/* Petites étincelles animées */}
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="absolute -top-2 -right-2 text-pink-deep"
          >
            <Sparkles size={16} />
          </motion.div>
        </motion.div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="font-serif italic text-hello-black/60 text-lg">Préparation de ton espace...</p>
        <div className="flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 bg-pink-candy rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
