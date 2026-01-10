import { useMemo } from 'react'
import { Trophy, Star, Target, Heart, Calendar, Clock, Sparkles, TrendingUp } from 'lucide-react'
import { progressService } from '../services/progress.service'
import { statsService } from '../services/stats.service'
import { subjectService } from '../services/subject.service'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { motion } from 'framer-motion'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { useQuery } from '@tanstack/react-query'

export default function Progress() {
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['progress-summary'],
    queryFn: progressService.getSummary
  })

  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ['progress-history'],
    queryFn: progressService.getAll
  })

  const { data: globalStats, isLoading: statsLoading } = useQuery({
    queryKey: ['global-stats'],
    queryFn: statsService.getGlobalStats
  })

  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAll
  })

  const isLoading = summaryLoading || historyLoading || statsLoading || subjectsLoading

  const getSubjectName = (session: any) => {
    if (session.matiere) return session.matiere
    const subject = subjects.find((s: any) => s._id === session.subjectId)
    return subject ? subject.name : (session.subjectId || 'Inconnue')
  }

  const chartData = useMemo(() => {
    // Si on a des stats réelles, on les utilise
    if (globalStats?.masteryRadar && globalStats.masteryRadar.length >= 3) {
      return globalStats.masteryRadar;
    }
    
    // Sinon, on construit un radar à partir des matières existantes
    if (subjects && subjects.length > 0) {
      const baseData = subjects.map(s => ({
        subject: s.name,
        score: globalStats?.masteryRadar?.find(m => m.subject === s.name)?.score || 0
      }));

      // Si on a moins de 3 matières, le radar ne s'affichera pas bien
      // Mais on retourne quand même les données pour le test de longueur
      return baseData;
    }

    return [];
  }, [globalStats, subjects]);

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      {/* Background Decorative Elements - Design 2.0 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-pink-milk/30 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -8, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-cloud/20 rounded-full blur-[140px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto pt-8 px-4 md:px-8 relative z-10 space-y-10">
        {/* Header Section - Design Immersif */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/40 backdrop-blur-2xl rounded-[3.5rem] p-10 border border-white relative overflow-hidden group shadow-2xl shadow-black/[0.02]"
          >
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-pink-milk/20 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-125" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
              {/* Level Badge */}
              <div className="relative shrink-0">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-32 h-32 bg-white rounded-[2.5rem] flex flex-col items-center justify-center border-4 border-pink-milk shadow-xl relative z-10"
                >
                  <span className="text-[10px] font-bold text-pink-deep uppercase tracking-[0.2em] mb-1">Niveau</span>
                  <span className="text-5xl font-black text-hello-black tracking-tighter">
                    {summary?.level || 1}
                  </span>
                </motion.div>
                <div className="absolute -bottom-2 -right-2 bg-hello-black p-3 rounded-2xl shadow-2xl text-white rotate-12 z-20 group-hover:rotate-0 transition-all duration-500">
                  <Trophy className="size-6 text-soft-gold" />
                </div>
              </div>

              {/* Rank Info */}
              <div className="flex-1 w-full space-y-6">
                <div className="space-y-3 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/60 backdrop-blur-md rounded-full border border-white shadow-sm">
                    <TrendingUp size={14} className="text-pink-deep" />
                    <span className="text-[10px] font-bold text-pink-deep uppercase tracking-[0.2em]">
                      {summary?.rank || 'Apprentie'}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-hello-black tracking-tight leading-tight">
                    Ta Progression <span className="text-pink-deep italic font-serif font-normal">Éclatante</span>
                  </h2>
                  <p className="text-lg text-hello-black/40 font-medium italic">
                    {summary?.totalXP || 0} XP cumulés • <span className="text-pink-deep">Objectif {summary?.xpToNextLevel || 0} XP</span>
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="h-4 bg-white/50 rounded-full overflow-hidden border border-white p-1 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${((summary?.totalXP || 0) % 100)}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-pink-candy to-pink-deep rounded-full shadow-lg"
                    />
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-bold text-hello-black/30 uppercase tracking-[0.2em]">Chapitre {summary?.level || 1}</span>
                    <span className="text-[10px] font-bold text-pink-deep uppercase tracking-[0.2em]">Chapitre {(summary?.level || 1) + 1}</span>
                  </div>
                </div>
              </div>

              {/* Quick Streak Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="lg:w-1/4 bg-hello-black text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group/streak shrink-0"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 group-hover/streak:scale-150 transition-transform duration-1000 blur-2xl" />
                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 transition-transform duration-500 group-hover/streak:rotate-12">
                    <Star className="text-soft-gold size-8" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.3em] mb-1">Série Actuelle</p>
                    <p className="text-4xl font-black tracking-tighter">
                      {globalStats?.streakDays || 0} <span className="text-lg font-medium opacity-40">j</span>
                    </p>
                  </div>
                  <p className="text-xs text-white/50 font-medium italic">
                    Ta constance est remarquable ✨
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Stats & Radar Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Radar Chart Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 bg-white/40 backdrop-blur-xl rounded-[3.5rem] p-10 border border-white relative overflow-hidden group shadow-xl shadow-black/[0.01]"
          >
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-milk/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="relative z-10 mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white rounded-2xl border border-pink-candy/10 shadow-sm">
                  <Target size={22} className="text-pink-deep" />
                </div>
                <h3 className="text-[10px] font-bold text-hello-black uppercase tracking-[0.3em]">
                  Équilibre de Maîtrise
                </h3>
              </div>
              <h4 className="text-2xl font-black text-hello-black tracking-tight leading-tight">Ton Radar de Succès</h4>
            </div>
            
            <div className="w-full h-[320px] relative z-10">
              {chartData.length >= 3 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#FF8FAB" strokeOpacity={0.2} />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#2D3436', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Maîtrise"
                      dataKey="score"
                      stroke="#FF8FAB"
                      fill="#FF8FAB"
                      fillOpacity={0.4}
                      strokeWidth={4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center border-2 border-pink-candy/10 border-dashed animate-pulse">
                    <Target className="text-pink-deep/20" size={40} />
                  </div>
                  <p className="text-lg text-hello-black/40 font-medium italic leading-relaxed">
                    Ajoute au moins 3 matières pour débloquer ton radar
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Detailed Stats Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard 
              icon={<Clock className="size-6" />}
              label="Temps Total"
              value={`${globalStats?.totalStudyTime || 0} min`}
              color="bg-pink-milk/50"
              delay={0.1}
            />
            <StatCard 
              icon={<Target className="size-6" />}
              label="Moyenne Session"
              value={`${globalStats?.averageSessionDuration || 0} min`}
              color="bg-blue-cloud/40"
              delay={0.2}
            />
            <StatCard 
              icon={<Star className="size-6" />}
              label="Matière Favorite"
              value={globalStats?.mostStudiedSubject || 'N/A'}
              color="bg-sage-soft/30"
              delay={0.3}
            />
            <StatCard 
              icon={<Heart className="size-6" />}
              label="Succès Total"
              value={summary?.streak || 0}
              color="bg-soft-gold/20"
              delay={0.4}
            />
          </div>
        </div>

        {/* History Table - Design 2.0 */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-hello-black tracking-tight">
                Journal de <span className="text-pink-deep italic font-serif font-normal">Bord</span>
              </h2>
              <p className="text-lg text-hello-black/40 font-medium italic">Tes dernières sessions</p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/40 backdrop-blur-xl rounded-[3.5rem] overflow-hidden border border-white shadow-xl shadow-black/[0.01]"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/40 border-b border-white">
                    <th className="px-8 py-6 text-[10px] font-bold text-pink-deep uppercase tracking-[0.3em]">Date</th>
                    <th className="px-8 py-6 text-[10px] font-bold text-pink-deep uppercase tracking-[0.3em]">Matière</th>
                    <th className="px-8 py-6 text-[10px] font-bold text-pink-deep uppercase tracking-[0.3em]">Durée</th>
                    <th className="px-8 py-6 text-[10px] font-bold text-pink-deep uppercase tracking-[0.3em] text-right">Gain XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white">
                  {history.length > 0 ? history.slice(0, 10).map((session: any, i: number) => (
                    <motion.tr 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-white/60 transition-all duration-300 group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-xl text-pink-deep border border-pink-candy/10 group-hover:rotate-12 transition-transform">
                            <Calendar className="size-4" />
                          </div>
                          <span className="font-bold text-hello-black/60 text-xs uppercase tracking-wider">
                            {new Date(session.date || '').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-black text-hello-black text-lg tracking-tight group-hover:text-pink-deep transition-colors">
                          {getSubjectName(session)}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-hello-black/40 text-xs font-bold uppercase tracking-wider">
                          <Clock className="size-4" />
                          {session.durationMinutes} min
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="inline-flex items-center gap-2 font-black text-pink-deep bg-white px-4 py-2 rounded-2xl text-[10px] border border-pink-candy/10 shadow-sm uppercase tracking-widest">
                          <Sparkles size={12} className="text-pink-candy" />
                          +{session.xpGained || 0} XP
                        </span>
                      </td>
                    </motion.tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center border-2 border-pink-candy/10 border-dashed">
                            <Star size={32} className="text-pink-deep/20" />
                          </div>
                          <p className="text-hello-black/30 font-bold uppercase tracking-[0.3em] text-xs">L'aventure commence ici...</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, delay }: { icon: React.ReactNode, label: string, value: string | number, color: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white flex flex-col justify-center relative group overflow-hidden shadow-lg shadow-black/[0.01]"
    >
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-milk/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
      <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative z-10 border border-white shadow-sm`}>
        {icon}
      </div>
      <p className="text-[10px] font-bold text-hello-black/30 uppercase tracking-[0.3em] mb-2 relative z-10">{label}</p>
      <p className="text-2xl font-black text-hello-black tracking-tight truncate relative z-10">{value}</p>
    </motion.div>
  )
}
