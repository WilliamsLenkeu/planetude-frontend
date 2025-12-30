import { useState, useEffect } from 'react'
import { Heart, Star, Trophy, Clock, ArrowRight, Sparkles as SparklesIcon, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { progressService } from '../services/progress.service'
import { statsService } from '../services/stats.service'
import { useAuth } from '../contexts/AuthContext'
import type { GlobalStats, ProgressSummary } from '../types/index'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

export default function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<ProgressSummary | null>(null)
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On extrait le prénom pour une interaction plus naturelle
  const firstName = user?.name?.split(' ')[0] || 'ma belle'

  // Valeurs par défaut sécurisées
  const safeStats = {
    level: summary?.level ?? 1,
    xp: summary?.totalXP ? (summary.totalXP % 100) : 0,
    streak: globalStats?.streakDays ?? 0,
    totalStudyTime: globalStats?.totalStudyTime ?? 0,
    completionRate: globalStats?.completionRate ?? 0,
    hearts: 5
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, statsData] = await Promise.all([
          progressService.getSummary(),
          statsService.getGlobalStats()
        ])
        setSummary((summaryData as any).data || summaryData)
        setGlobalStats((statsData as any).data || statsData)
      } catch (error) {
        console.error('Erreur dashboard:', error)
        toast.error('Impossible de charger les statistiques')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) return <LoadingSpinner />
  
  return (
    <div className="h-full flex flex-col gap-8 md:gap-10 relative max-w-7xl mx-auto w-full px-4">
      {/* Header : Bienvenue & Niveau */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 shrink-0 relative">
        {/* Binder Rings Simulation */}
        <div className="hidden md:flex absolute left-[-2rem] top-10 bottom-10 flex-col justify-around z-20">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-100 border border-gray-400/30 shadow-sm shadow-inner" />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-8 notebook-page p-8 md:p-12 flex flex-col justify-center overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
            <SparklesIcon size={200} className="text-hello-black" />
          </div>
          
          <div className="relative z-10 pl-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-pink-candy/10 rounded-full flex items-center justify-center border border-pink-candy/20">
                <Heart size={24} className="text-pink-candy" />
              </div>
              <h1 className="text-3xl md:text-5xl font-semibold text-hello-black tracking-tight font-display">
                Journal de <span className="text-pink-candy">{firstName}</span>.
              </h1>
            </div>
            <p className="text-hello-black/40 text-lg md:text-xl font-medium max-w-xl leading-relaxed italic font-serif">
              "La discipline est la forme la plus pure de l'amour propre." ✨
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-4 notebook-page p-8 flex flex-col justify-center gap-8 border-l-4 border-blue-200"
        >
          <div className="flex items-center gap-6 pl-8">
            <div className="w-16 h-16 bg-clean-white rounded-full flex items-center justify-center border-2 border-pink-milk shadow-inner relative">
              <span className="text-2xl font-semibold text-hello-black font-display">{safeStats.level}</span>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-soft-gold rounded-full flex items-center justify-center text-white shadow-sm border border-white">
                <Star size={12} fill="currentColor" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-hello-black/30 uppercase tracking-[0.2em] mb-1">Chapitre</p>
              <h3 className="text-xl font-semibold text-hello-black">Niveau {safeStats.level}</h3>
            </div>
          </div>

          <div className="space-y-4 pl-8">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold text-hello-black/20 uppercase tracking-widest italic">Expérience accumulée</span>
              <span className="text-xs font-semibold text-hello-black/40 font-mono">{safeStats.xp}%</span>
            </div>
            <div className="h-1 bg-pink-milk/60 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${safeStats.xp}%` }}
                className="h-full bg-pink-candy rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content : Stats & Actions */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 min-h-0">
        {/* Colonne Stats Latérale (3/12) */}
        <div className="md:col-span-3 flex flex-col gap-6">
          <div className="notebook-page p-8 flex flex-col gap-2 border-l-4 border-sage-soft">
            <div className="flex items-center gap-3 text-hello-black/40 mb-2 pl-4">
              <Clock size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Temps de Focus</span>
            </div>
            <p className="text-2xl font-semibold text-hello-black pl-4">{Math.floor(safeStats.totalStudyTime / 60)}h {safeStats.totalStudyTime % 60}m</p>
          </div>
          
          <div className="notebook-page p-8 flex flex-col gap-2 border-l-4 border-soft-gold">
            <div className="flex items-center gap-3 text-hello-black/40 mb-2 pl-4">
              <Star size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Série</span>
            </div>
            <p className="text-2xl font-semibold text-hello-black pl-4">{safeStats.streak} jours</p>
          </div>

          <div className="notebook-page p-8 flex flex-col gap-2 border-l-4 border-pink-200">
            <div className="flex items-center gap-3 text-hello-black/40 mb-2 pl-4">
              <Heart size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Énergie</span>
            </div>
            <p className="text-2xl font-semibold text-hello-black pl-4">{safeStats.hearts}/5</p>
          </div>
        </div>

        {/* Colonne Actions (9/12) */}
        <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Action Card : Planning */}
          <motion.div 
            whileHover={{ rotate: -1, y: -4 }}
            className="notebook-page p-10 flex flex-col justify-between border-l-4 border-pink-300 group"
          >
            <div className="pl-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-pink-candy mb-8 shadow-sm border border-pink-milk group-hover:rotate-12 transition-transform">
                <Calendar size={24} />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-hello-black font-display">Mon Agenda</h3>
              <p className="text-hello-black/40 font-medium mb-10 leading-relaxed text-sm italic font-serif">
                Planifie tes rêves, une session à la fois. Ton futur s'écrit ici.
              </p>
            </div>

            <Link to="/planning" className="kawaii-button primary w-full mx-auto max-w-[200px]">
              <span>Consulter</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Action Card : AI Coach */}
          <motion.div 
            whileHover={{ rotate: 1, y: -4 }}
            className="notebook-page p-10 flex flex-col justify-between border-l-4 border-blue-300 group"
          >
            <div className="pl-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-cloud mb-8 shadow-sm border border-blue-cloud group-hover:-rotate-12 transition-transform">
                <SparklesIcon size={24} className="text-hello-black/40" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-hello-black font-display">PixelCoach</h3>
              <p className="text-hello-black/40 font-medium mb-10 leading-relaxed text-sm italic font-serif">
                Un petit mot d'encouragement ou une question ? Je suis là.
              </p>
            </div>

            <Link to="/chat" className="kawaii-button w-full mx-auto max-w-[200px]">
              <span>Échanger</span>
              <SparklesIcon size={16} />
            </Link>
          </motion.div>

          {/* Bottom Bar Stats */}
          <div className="md:col-span-2 notebook-page p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-l-4 border-sage-soft">
            <div className="flex items-center gap-6 pl-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-sage-soft">
                <Trophy size={22} className="text-hello-black/30" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-hello-black/20 uppercase tracking-widest mb-0.5">Note de session</p>
                <p className="text-lg font-semibold text-hello-black">{safeStats.completionRate}% de réussite.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8 pr-6">
              <div className="text-center md:text-right">
                <p className="text-[10px] font-bold text-hello-black/20 uppercase tracking-[0.2em] font-mono">2024 ED.</p>
                <p className="text-xs font-semibold text-pink-candy mt-1 italic opacity-60">PlanÉtude Studio.</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-pink-milk flex items-center justify-center">
                <Heart size={18} className="text-pink-candy/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
