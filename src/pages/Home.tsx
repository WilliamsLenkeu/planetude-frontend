import { Link } from 'react-router-dom'
import { Coffee, BookOpen, Star, Sparkles, Heart, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FFFAFA] flex flex-col items-center justify-center py-20 px-4">
      {/* Background Ornaments - Design 2.0 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-pink-milk/30 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, -40, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-cloud/20 rounded-full blur-[100px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-6xl z-10"
      >
        <div className="bg-white/40 backdrop-blur-2xl rounded-[4rem] p-12 md:p-20 border border-white shadow-2xl shadow-black/[0.02] relative overflow-hidden group">
          {/* Decorative accents */}
          <div className="absolute top-10 right-10 opacity-20 group-hover:rotate-12 transition-transform duration-1000">
            <Sparkles size={40} className="text-pink-deep" />
          </div>
          <div className="absolute bottom-10 left-10 opacity-10 group-hover:-rotate-12 transition-transform duration-1000">
            <Heart size={30} className="text-pink-candy" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/60 border border-white shadow-sm text-pink-deep text-[10px] font-bold uppercase tracking-[0.3em]"
            >
              <div className="w-2 h-2 bg-pink-candy rounded-full animate-pulse" />
              <Star size={12} className="fill-pink-candy text-pink-candy" />
              Planétude Studio
            </motion.div>
            
            <div className="space-y-6 max-w-4xl">
              <h1 className="text-5xl md:text-8xl font-black text-hello-black leading-[0.85] tracking-tight">
                Ton journal de <br />
                <span className="text-pink-deep italic font-serif font-normal">réussite.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-hello-black/40 max-w-2xl mx-auto leading-relaxed font-medium italic">
                L'élégance minimaliste au service de ton ambition. Organise ta vie étudiante avec douceur et intelligence.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/auth/register" 
                  className="bg-hello-black text-white px-10 py-5 rounded-[2rem] font-bold text-sm flex items-center gap-3 shadow-2xl shadow-hello-black/20 hover:bg-pink-deep hover:text-hello-black transition-all duration-500 group"
                >
                  Ouvrir mon carnet
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/auth/login" 
                  className="bg-white/60 backdrop-blur-md text-hello-black px-10 py-5 rounded-[2rem] font-bold text-sm border border-white shadow-lg hover:bg-white transition-all duration-500"
                >
                  Se connecter
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4 relative z-10">
        <FeatureCard 
          icon={<BookOpen className="text-pink-deep" size={28} strokeWidth={1.5} />}
          title="Organisation"
          description="Une vision claire et apaisante de tes objectifs académiques."
          delay={0.6}
        />
        <FeatureCard 
          icon={<Coffee className="text-pink-deep" size={28} strokeWidth={1.5} />}
          title="Zen Mode"
          description="Focalise-toi sur l'essentiel avec nos ambiances immersives."
          delay={0.8}
        />
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white/40 backdrop-blur-xl p-10 rounded-[3.5rem] flex flex-col items-center text-center space-y-4 border border-white shadow-xl shadow-black/[0.01] hover:bg-white/60 transition-all duration-500"
    >
      <div className="p-4 bg-white rounded-2xl shadow-sm border border-pink-candy/10">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-hello-black">{title}</h3>
        <p className="text-sm text-hello-black/40 font-medium italic leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}
