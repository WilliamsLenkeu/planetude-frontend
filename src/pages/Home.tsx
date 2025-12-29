import { Link } from 'react-router-dom'
import { Heart, Star, Sparkles, Coffee } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-16">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className="relative w-full max-w-4xl"
      >
        {/* Éléments flottants décoratifs */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-12 -left-8 text-pink-candy/40"
        >
          <Heart size={80} fill="currentColor" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-12 -right-8 text-magic-purple/40"
        >
          <Sparkles size={80} />
        </motion.div>
        
        <div className="kawaii-card bg-white/40 backdrop-blur-xl border-2 border-white/60 p-12 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-candy via-magic-purple to-pink-candy" />
          
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold text-hello-black leading-tight">
              Étudie avec <span className="text-pink-candy sparkle">douceur</span> 🌸
            </h1>
            <p className="text-2xl text-hello-black/70 max-w-2xl mx-auto leading-relaxed">
              Le compagnon idéal pour tes révisions. Gagne des badges, collectionne des cœurs et laisse <span className="text-pink-candy font-bold">PixelCoach</span> veiller sur toi.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <Link to="/auth/register" className="kawaii-button text-xl px-12 py-4 shadow-lg hover:shadow-pink-candy/40">
              Commencer l'aventure ✨
            </Link>
            <Link to="/auth/login" className="bg-white/60 backdrop-blur-md border-2 border-pink-candy/30 text-hello-black font-bold py-4 px-12 rounded-kawaii-lg hover:bg-pink-milk transition-all duration-300">
              Se connecter
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <FeatureCard 
          icon={<Sparkles className="text-pink-candy" />}
          title="PixelCoach IA"
          description="Ton assistant adorable qui t'aide à planifier tes révisions sans stress."
        />
        <FeatureCard 
          icon={<Heart className="text-pink-candy" />}
          title="Récompenses"
          description="Gagne des badges et collectionne des cœurs en restant productive."
        />
        <FeatureCard 
          icon={<Coffee className="text-hello-black" />}
          title="Zen Mode"
          description="Une interface douce et sans distractions pour une concentration maximale."
        />
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="kawaii-card flex flex-col items-center text-center p-8 bg-pink-milk/50 border-2 border-pink-candy/20"
    >
      <div className="mb-4 p-3 bg-white rounded-full shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-hello-black">{title}</h3>
      <p className="text-hello-black/60">{description}</p>
    </motion.div>
  )
}
