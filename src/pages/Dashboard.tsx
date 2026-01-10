import { useMemo } from 'react'
import { Heart, Star, Trophy, Clock, ArrowRight, Calendar, Book, Music, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { progressService } from '../services/progress.service'
import { statsService } from '../services/stats.service'
import { useAuth } from '../contexts/AuthContext'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['progress-summary'],
    queryFn: progressService.getSummary
  })

  const { data: globalStats, isLoading: statsLoading } = useQuery({
    queryKey: ['global-stats'],
    queryFn: statsService.getGlobalStats
  })

  const isLoading = summaryLoading || statsLoading

  // On extrait le prénom pour une interaction plus naturelle - Memoized
  const firstName = useMemo(() => user?.name?.split(' ')[0] || 'ma belle', [user?.name])

  // Valeurs par défaut sécurisées - Memoized
  const safeStats = useMemo(() => ({
    level: globalStats?.level ?? summary?.level ?? 1,
    xp: globalStats?.xp ? (globalStats.xp % 100) : (summary?.totalXP ? (summary.totalXP % 100) : 0),
    streak: globalStats?.streakDays ?? 0,
    totalStudyTime: globalStats?.totalStudyTime ?? 0,
    completionRate: globalStats?.completionRate ?? 0,
    hearts: 5
  }), [summary, globalStats])

  if (isLoading) return <LoadingSpinner />
  
  return (
    <div className="min-h-screen relative overflow-hidden  pb-20">
      {/* Background Decorative Elements - Plus subtils et organiques */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-pink-milk/30 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -8, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-blue-cloud/20 rounded-full blur-[140px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto pt-8 px-4 md:px-8 relative z-10 space-y-8">
        {/* Header : Bienvenue - Design 2.0 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 bg-white/40 backdrop-blur-xl rounded-[3.5rem] p-10 border border-white relative overflow-hidden group shadow-2xl shadow-black/[0.02]"
          >
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-pink-milk/20 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-125" />
            
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/60 backdrop-blur-md rounded-full border border-white shadow-sm">
                <div className="w-2 h-2 bg-pink-candy rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-pink-deep uppercase tracking-[0.2em]">Dashboard</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-black text-hello-black tracking-tight leading-[0.9]">
                  Hello, <br />
                  <span className="text-pink-deep italic font-serif font-normal">{firstName}.</span>
                </h1>
                
                <p className="text-lg text-hello-black/40 font-medium max-w-lg leading-relaxed italic">
                  "Chaque petit pas est une victoire vers la version la plus éclatante de toi-même." ✨
                </p>
              </div>

              <div className="flex pt-4">
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/planning')}
                  className="bg-hello-black text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-hello-black/10 hover:bg-pink-deep hover:text-hello-black transition-colors duration-500"
                >
                  Continuer l'aventure
                  <ArrowRight size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 bg-white/60 backdrop-blur-xl rounded-[3.5rem] p-10 border border-white flex flex-col justify-between relative overflow-hidden group shadow-2xl shadow-black/[0.02]"
          >
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-milk/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-pink-candy/10 shadow-sm group-hover:rotate-6 transition-transform duration-500">
                <Trophy className="text-pink-deep" size={28} strokeWidth={1.5} />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-pink-deep/40 uppercase tracking-[0.3em] block mb-1">Niveau</span>
                <p className="text-5xl font-black text-hello-black tracking-tighter">{safeStats.level}</p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-hello-black/40 uppercase tracking-[0.3em]">Progression XP</span>
                  <span className="text-sm font-black text-pink-deep">{safeStats.xp}%</span>
                </div>
                <div className="h-3 bg-white/50 rounded-full overflow-hidden border border-white p-0.5 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${safeStats.xp}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-pink-candy to-pink-deep rounded-full"
                  />
                </div>
              </div>
              <p className="text-[11px] text-hello-black/40 font-bold text-center uppercase tracking-[0.2em] leading-relaxed italic">
                Bientôt au niveau <span className="text-pink-deep">{safeStats.level + 1}</span> 🌸
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid - Plus aéré */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatItem 
            icon={<Star className="text-orange-400" size={24} />}
            label="Série"
            value={`${safeStats.streak} j`}
            delay={0.2}
          />
          <StatItem 
            icon={<Clock className="text-pink-deep" size={24} />}
            label="Focus"
            value={`${Math.round(safeStats.totalStudyTime / 60)}h`}
            delay={0.3}
          />
          <StatItem 
            icon={<Heart className="text-pink-candy" size={24} />}
            label="Objectifs"
            value={`${safeStats.completionRate}%`}
            delay={0.4}
          />
          <Link to="/planning" className="block h-full group">
            <StatItem 
              icon={<Calendar className="text-hello-black group-hover:rotate-12 transition-transform" size={24} />}
              label="Planning"
              value="Voir"
              delay={0.5}
              isAction
            />
          </Link>
        </div>

        {/* Quick Actions Grid - Cards plus grandes et plus belles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionCard 
            onClick={() => navigate('/subjects')}
            icon={<Book size={24} />}
            title="Matières"
            description="Organise tes cours"
            color="bg-pink-milk/40"
            delay={0.6}
          />
          <ActionCard 
            onClick={() => navigate('/planning')}
            icon={<Calendar size={24} />}
            title="Planning"
            description="IA Scheduler"
            color="bg-soft-gold/20"
            delay={0.7}
          />
          <ActionCard 
            onClick={() => navigate('/lofi')}
            icon={<Music size={24} />}
            title="Focus"
            description="Lo-Fi Studio"
            color="bg-blue-cloud/40"
            delay={0.8}
          />
          <ActionCard 
            onClick={() => navigate('/progress')}
            icon={<TrendingUp size={24} />}
            title="Progrès"
            description="Stats & Évolution"
            color="bg-sage-soft/30"
            delay={0.9}
          />
        </div>
      </div>
    </div>
  )
}

function StatItem({ icon, label, value, delay, isAction = false }: { icon: React.ReactNode, label: string, value: string, delay: number, isAction?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-white/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white flex flex-col items-center justify-center space-y-2 group shadow-lg shadow-black/[0.01] ${isAction ? 'hover:bg-white/60 cursor-pointer transition-all duration-500' : ''}`}
    >
      <div className="mb-1 transition-transform duration-500 group-hover:scale-110">
        {icon}
      </div>
      <div className="text-center">
        <p className="text-[10px] font-bold text-hello-black/30 uppercase tracking-[0.2em] mb-0.5">{label}</p>
        <p className="text-xl font-black text-hello-black">{value}</p>
      </div>
    </motion.div>
  )
}

function ActionCard({ onClick, icon, title, description, color, delay }: { onClick: () => void, icon: React.ReactNode, title: string, description: string, color: string, delay: number }) {
  return (
    <motion.div 
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white flex flex-col items-center text-center group cursor-pointer shadow-lg shadow-black/[0.01] hover:bg-white/60 transition-all duration-500"
    >
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-hello-black mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-hello-black mb-1">{title}</h3>
      <p className="text-xs text-hello-black/40 font-medium italic">
        {description}
      </p>
    </motion.div>
  )
}
