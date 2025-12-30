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
import { StatCard } from '../components/ui/StatCard'

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
    <div className="h-full flex flex-col gap-4 md:gap-6 relative">
      {/* Éléments Hello Kitty discrets */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none select-none text-4xl rotate-[15deg] z-0">🎀</div>
      <div className="absolute bottom-10 left-0 opacity-10 pointer-events-none select-none text-3xl rotate-[-10deg] z-0">✨</div>

      {/* Header : Bienvenue & Niveau */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-white/60 backdrop-blur-sm border border-pink-milk/50 p-4 md:p-6 rounded-kawaii shadow-clean flex flex-col justify-center"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-hello-black">
              Coucou {firstName} ! <span className="text-pink-candy">🎀</span>
            </h1>
          </div>
          <p className="text-hello-black/50 text-xs md:text-sm font-medium italic mt-1">
            "Chaque petit pas te rapproche de tes rêves. Prête pour aujourd'hui ? ✨"
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-sm border border-pink-milk/50 p-4 md:p-6 rounded-kawaii shadow-clean flex items-center gap-4"
        >
          <div className="relative shrink-0">
            <div className="w-12 h-12 bg-pink-candy rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <span className="text-lg font-bold text-hello-black">{safeStats.level}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm border border-pink-milk">
              <Trophy size={12} className="text-pink-candy" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] font-bold text-hello-black/40 uppercase">Progression XP</span>
              <span className="text-[10px] font-bold text-pink-candy">{safeStats.xp}%</span>
            </div>
            <div className="h-2 bg-pink-milk/30 rounded-full overflow-hidden border border-pink-milk/10">
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
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 min-h-0">
        {/* Colonne Stats Latérale (1/4) - Temps & Série */}
        <div className="md:col-span-1 grid grid-cols-2 md:grid-cols-1 gap-3 overflow-y-auto custom-scrollbar pr-1 content-start">
          <StatCard 
            icon={<Clock className="text-pink-candy" size={18} />}
            label="Temps total"
            value={`${Math.floor(safeStats.totalStudyTime / 60)}h ${safeStats.totalStudyTime % 60}m`}
            className="!p-3 border-pink-milk/30"
          />
          <StatCard 
            icon={<Star className="text-soft-gold" size={18} />}
            label="Série"
            value={`${safeStats.streak} jours`}
            className="!p-3 border-pink-milk/30"
          />
        </div>

        {/* Colonne Actions & Focus (3/4) */}
        <div className="md:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Planning & Réussite */}
            <div className="flex flex-col gap-4">
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/80 border border-pink-candy/20 p-5 rounded-kawaii shadow-clean group relative overflow-hidden h-full"
              >
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Calendar size={48} className="text-pink-candy" />
                </div>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  Mon Planning 📅
                </h3>
                <p className="text-sm text-hello-black/60 mb-4">
                  {safeStats.totalStudyTime === 0 
                    ? "Commence ton aventure dès maintenant ! 🌸" 
                    : "Continue sur ta lancée, tu gères ! ✨"}
                </p>
                <Link to="/planning" className="kawaii-button inline-flex items-center gap-2 !py-2 !px-5 text-sm">
                  Gérer mes sessions <ArrowRight size={16} />
                </Link>
              </motion.div>
              
              <StatCard 
                icon={<Trophy className="text-pink-candy" size={18} />}
                label="Ma Réussite"
                value={`${safeStats.completionRate}%`}
                className="!p-4 border-pink-milk/30 bg-white/60 backdrop-blur-sm"
              />
            </div>

            {/* PixelCoach & Énergie */}
            <div className="flex flex-col gap-4">
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/80 border border-magic-purple/30 p-5 rounded-kawaii shadow-clean group relative overflow-hidden h-full"
              >
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                  <SparklesIcon size={48} className="text-magic-purple" />
                </div>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  PixelCoach 🐾
                </h3>
                <p className="text-sm text-hello-black/60 mb-4">
                  Besoin d'un conseil ou d'un planning sur mesure ?
                </p>
                <Link to="/chat" className="bg-magic-purple/20 text-hello-black font-bold py-2 px-5 rounded-full text-sm hover:bg-magic-purple/40 transition-all inline-flex items-center gap-2">
                  Discuter avec le coach 🌸
                </Link>
              </motion.div>

              <StatCard 
                icon={<Heart className="text-pink-candy" size={18} />}
                label="Mon Énergie"
                value={`${safeStats.hearts}/5`}
                className="!p-4 border-pink-milk/30 bg-white/60 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Section Progrès Rapide ou Citations */}
          <div className="mt-auto bg-white/40 border border-pink-milk/30 p-4 rounded-kawaii flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <SparklesIcon size={20} className="text-pink-candy" />
              </div>
              <p className="text-xs md:text-sm font-medium text-hello-black/70">
                "Le secret de la réussite, c'est de commencer avec le sourire." 🌸
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-hello-black/30 uppercase tracking-widest">Style Clean Girl ✨ Approved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
