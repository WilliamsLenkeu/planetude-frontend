import { Link } from 'react-router-dom'
import { Sparkles, Coffee, BookOpen, PenTool, Star } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-5xl"
      >
        {/* Anneaux de classeur pour l'immersion */}
        <div className="absolute left-10 top-0 bottom-0 flex flex-col justify-around z-20 pointer-events-none hidden lg:flex">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-100 border border-gray-400/30 shadow-sm" />
          ))}
        </div>

        {/* Décorations de bureau */}
        <motion.div 
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute -top-10 -right-5 z-30 hidden md:block"
        >
          <div className="bg-pink-candy/20 backdrop-blur-sm p-3 rounded-lg border border-pink-candy/10 shadow-sm rotate-12">
            <PenTool size={32} className="text-pink-deep" />
          </div>
        </motion.div>

        <div className="notebook-page p-8 md:p-16 relative overflow-hidden shadow-2xl mx-4">
          {/* Ligne de marge rouge style cahier */}
          <div className="absolute left-20 top-0 bottom-0 w-[2px] bg-pink-candy/20 hidden md:block" />
          
          <div className="relative z-10 space-y-12 md:pl-16">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-milk/50 border border-pink-candy/10 text-pink-deep text-sm font-black uppercase tracking-widest">
                <Star size={14} className="fill-pink-deep" />
                Planétude
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black text-hello-black leading-[1.1] tracking-tight">
                Ton journal de <br />
                <span className="text-pink-candy italic font-serif">réussite.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-hello-black/60 max-w-2xl leading-relaxed font-display">
                L'esthétique <span className="text-pink-deep underline decoration-pink-candy/30 underline-offset-4">Clean Girl</span> rencontre l'IA pour transformer ta façon d'apprendre. Doux, organisé, et incroyablement efficace.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <Link 
                to="/auth/register" 
                className="bg-hello-black text-white px-10 py-5 rounded-none shadow-notebook hover:translate-y-[-4px] hover:shadow-2xl transition-all duration-300 font-black uppercase tracking-widest text-sm"
              >
                Ouvrir mon carnet ✨
              </Link>
              <Link 
                to="/auth/login" 
                className="bg-white border-2 border-hello-black text-hello-black px-10 py-5 rounded-none hover:bg-pink-milk transition-all duration-300 font-black uppercase tracking-widest text-sm"
              >
                Se connecter
              </Link>
            </div>

            {/* Citations style Post-it */}
            <div className="absolute bottom-10 right-10 hidden xl:block">
              <motion.div 
                whileHover={{ rotate: 0 }}
                className="bg-yellow-100/80 p-6 shadow-sm rotate-3 border-t-4 border-yellow-200 w-48"
              >
                <p className="font-serif italic text-yellow-800 text-sm">
                  "Le succès est la somme de petits efforts répétés jour après jour."
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl px-4">
        <FeatureCard 
          icon={<Sparkles className="text-pink-deep" />}
          title="PixelCoach IA"
          description="Ton coach personnel qui comprend tes besoins et adapte ton planning avec douceur."
          rotate="-1deg"
        />
        <FeatureCard 
          icon={<BookOpen className="text-pink-deep" />}
          title="Organisation"
          description="Une vision claire de tes sujets, devoirs et rappels dans une interface apaisante."
          rotate="1deg"
        />
        <FeatureCard 
          icon={<Coffee className="text-pink-deep" />}
          title="Zen Mode"
          description="Focalise-toi sur l'essentiel avec nos ambiances LoFi intégrées pour tes sessions."
          rotate="-0.5deg"
        />
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description, rotate }: { icon: React.ReactNode, title: string, description: string, rotate: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10, rotate: 0 }}
      style={{ rotate }}
      className="bg-white p-10 shadow-notebook border-l-4 border-pink-candy flex flex-col items-center text-center space-y-4"
    >
      <div className="p-4 bg-pink-milk/30 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-black text-hello-black uppercase tracking-wider">{title}</h3>
      <p className="text-hello-black/60 font-display leading-relaxed">{description}</p>
    </motion.div>
  )
}
