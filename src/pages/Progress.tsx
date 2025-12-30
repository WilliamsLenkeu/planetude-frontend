import { useState, useEffect } from 'react'
import { Trophy, Star, Target, Heart, TrendingUp, Calendar, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { userService } from '../services/user.service'
import { progressService } from '../services/progress.service'
import { statsService } from '../services/stats.service'
import { subjectService } from '../services/subject.service'
import type { Badge, ProgressSession, ProgressSummary, GlobalStats, Subject } from '../types/index'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { BadgeItem } from '../components/ui/BadgeItem'
import { motion } from 'framer-motion'

export default function Progress() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [summary, setSummary] = useState<ProgressSummary | null>(null)
  const [history, setHistory] = useState<ProgressSession[]>([])
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [badgesData, summaryData, historyData, statsData, subjectsData] = await Promise.all([
          userService.getBadges(),
          progressService.getSummary(),
          progressService.getAll(),
          statsService.getGlobalStats(),
          subjectService.getAll()
        ])
        
        // Normalisation
        setBadges(Array.isArray(badgesData) ? badgesData : (badgesData as any).data || [])
        setSummary((summaryData as any).data || summaryData)
        setHistory((historyData as any).data || historyData)
        setGlobalStats((statsData as any).data || statsData)
        setSubjects(Array.isArray(subjectsData) ? subjectsData : (subjectsData as any).data || [])
      } catch (error) {
        console.error('Erreur progression:', error)
        toast.error('Impossible de charger les données de progression')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const getSubjectName = (id: string) => {
    const subject = subjects.find(s => s._id === id)
    return subject ? subject.name : id
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto py-4 md:py-12 space-y-8 md:space-y-16 px-3 md:px-8">
      {/* Résumé de Progression - Style Page de Garde */}
      <section className="relative">
        <div className="hidden md:flex absolute left-[-2rem] top-10 bottom-10 flex flex-col justify-around z-20">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-100 border border-gray-400/30 shadow-sm shadow-inner" />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="notebook-page p-4 md:p-12"
        >
          <div className="md:pl-8">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
              <div className="w-9 h-9 md:w-12 md:h-12 bg-pink-candy/10 rounded-full flex items-center justify-center border border-pink-candy/20 shrink-0">
                <TrendingUp className="size-4.5 md:size-6 text-pink-candy" />
              </div>
              <h2 className="text-xl md:text-5xl font-semibold text-hello-black font-display">
                Journal d' <span className="text-pink-candy">Ascension</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 items-center">
              <div className="md:col-span-2 space-y-5 md:space-y-8">
                <div className="flex items-center gap-4 md:gap-8">
                  <div className="relative group shrink-0">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center border-4 border-pink-milk shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <span className="text-2xl md:text-4xl font-bold text-pink-candy font-display">{summary?.level || 1}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-pink-candy p-1.5 md:p-2.5 rounded-full shadow-lg border-2 border-white text-white rotate-12">
                      <Trophy className="size-3.5 md:size-5" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-2 md:mb-4 gap-1 md:gap-2">
                      <div className="space-y-0.5 md:space-y-1">
                        <span className="text-lg md:text-2xl font-semibold text-hello-black block font-display truncate">{summary?.rank || 'Apprentie'} 🎀</span>
                        <span className="text-[8px] md:text-xs font-black text-pink-deep/40 uppercase tracking-widest block">Statut Actuel</span>
                      </div>
                      <span className="text-[9px] md:text-sm font-black text-pink-candy bg-pink-candy/5 px-2 md:px-4 py-1 md:py-1.5 rounded-full border border-pink-candy/10 self-start md:self-auto">
                        {summary?.totalXP || 0} XP au total
                      </span>
                    </div>
                    <div className="h-1.5 md:h-2 bg-pink-milk/20 rounded-full overflow-hidden border border-pink-milk/10 relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((summary?.totalXP || 0) % 100)}%` }}
                        className="h-full bg-pink-candy rounded-full"
                      />
                    </div>
                    <p className="text-[10px] md:text-xs text-hello-black/40 mt-2 md:mt-3 font-serif italic">
                      Encore {summary?.xpToNextLevel || 0} XP pour le prochain chapitre... ✨
                    </p>
                  </div>
                </div>
              </div>

              <motion.div 
                whileHover={{ rotate: -2, scale: 1.02 }}
                className="bg-hello-black text-white p-5 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-white/5 rounded-full -mr-12 md:-mr-16 -mt-12 md:-mt-16 group-hover:scale-150 transition-transform duration-700" />
                <Star className="text-soft-gold mb-2 md:mb-4 relative z-10 size-5 md:size-8" fill="currentColor" />
                <p className="text-[8px] md:text-[10px] opacity-50 uppercase font-black tracking-[0.2em] relative z-10">Série de Concentration</p>
                <p className="text-2xl md:text-5xl font-bold font-display relative z-10 mt-1">{globalStats?.streakDays || 0} Jours</p>
                <div className="mt-2 md:mt-4 h-[1px] w-8 md:w-12 bg-soft-gold/30 relative z-10" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Statistiques Globales - Style Notes Adhésives */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
        {[
          { icon: <Clock className="size-4 md:size-5" />, label: "Temps Total", value: `${globalStats?.totalStudyTime || 0} min`, color: "border-pink-candy" },
          { icon: <Target className="size-4 md:size-5" />, label: "Moyenne/Session", value: `${globalStats?.averageSessionDuration || 0} min`, color: "border-sage-soft" },
          { icon: <Star className="size-4 md:size-5" />, label: "Matière Favorite", value: globalStats?.mostStudiedSubject || 'N/A', color: "border-pink-candy" },
          { icon: <Heart className="size-4 md:size-5" />, label: "Succès", value: badges.filter(b => b.awardedAt).length, color: "border-sage-soft" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ rotate: i % 2 === 0 ? 2 : -2, y: -5 }}
            className={`bg-white p-4 md:p-8 rounded-sm shadow-notebook border-l-4 ${stat.color} relative group overflow-hidden`}
          >
            <div className="absolute top-0 right-0 p-1.5 md:p-2 opacity-5 group-hover:opacity-20 transition-opacity">
              {stat.icon}
            </div>
            <div className="text-pink-deep/40 mb-2 md:mb-4 group-hover:scale-110 transition-transform inline-block">
              {stat.icon}
            </div>
            <p className="text-[7px] md:text-[10px] font-black text-pink-deep/30 uppercase tracking-[0.2em] mb-0.5 md:mb-1">{stat.label}</p>
            <p className="text-base md:text-2xl font-semibold text-hello-black font-display truncate">{stat.value}</p>
          </motion.div>
        ))}
      </section>

      {/* Historique Récent - Style Carnet de Bord */}
      <section className="relative">
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
          <h2 className="text-lg md:text-3xl font-semibold text-hello-black font-display">
            Journal de <span className="text-pink-candy">Bord</span>
          </h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-pink-candy/20 to-transparent" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="notebook-page overflow-hidden p-0 shadow-lg md:shadow-2xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-pink-milk/10">
                  <th className="px-3 md:px-8 py-3 md:py-6 text-[7px] md:text-[10px] font-black text-pink-deep/40 uppercase tracking-[0.2em]">Date</th>
                  <th className="px-3 md:px-8 py-3 md:py-6 text-[7px] md:text-[10px] font-black text-pink-deep/40 uppercase tracking-[0.2em]">Matière</th>
                  <th className="px-3 md:px-8 py-3 md:py-6 text-[7px] md:text-[10px] font-black text-pink-deep/40 uppercase tracking-[0.2em]">Durée</th>
                  <th className="px-3 md:px-8 py-3 md:py-6 text-[7px] md:text-[10px] font-black text-pink-deep/40 uppercase tracking-[0.2em] text-right">XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-milk/5">
                {history.length > 0 ? history.slice(0, 5).map((session, i) => (
                  <tr key={i} className="hover:bg-pink-milk/5 transition-colors group">
                    <td className="px-3 md:px-8 py-3 md:py-6">
                      <div className="flex items-center gap-1.5 md:gap-3">
                        <Calendar className="size-2.5 md:size-3.5 text-pink-candy/40" />
                        <span className="font-medium text-hello-black/70 font-serif text-[10px] md:text-sm">
                          {new Date(session.date || '').toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 md:px-8 py-3 md:py-6">
                      <span className="font-semibold text-hello-black font-display text-[10px] md:text-base">{getSubjectName(session.subjectId)}</span>
                    </td>
                    <td className="px-3 md:px-8 py-3 md:py-6">
                      <div className="flex items-center gap-1 md:gap-2 text-hello-black/50 text-[10px] md:text-xs">
                        <Clock className="size-2.5 md:size-3" />
                        {session.durationMinutes}m
                      </div>
                    </td>
                    <td className="px-3 md:px-8 py-3 md:py-6 text-right">
                      <span className="font-black text-pink-candy text-[10px] md:text-sm">+{session.xpGained || 0}</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-8 md:py-12 text-center text-hello-black/30 font-serif italic text-xs md:text-sm">
                      Aucune session enregistrée... ✨
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      {/* Section Badges - Style Planche de Stickers */}
      <section className="space-y-6 md:space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-4">
          <div>
            <h2 className="text-lg md:text-3xl font-semibold text-hello-black font-display">
              Collection de <span className="text-pink-candy">Stickers</span>
            </h2>
            <p className="text-pink-deep/40 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-0.5 md:mt-1">
              Souvenirs de tes plus belles victoires
            </p>
          </div>
          <div className="bg-white px-4 md:px-6 py-1.5 md:py-2 rounded-full border border-pink-milk shadow-sm self-end md:self-auto">
            <span className="text-pink-candy font-bold text-[10px] md:text-sm">
              {badges.filter(b => b.awardedAt).length} <span className="text-pink-deep/30 mx-1">/</span> {badges.length} Débloqués
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-8">
          {badges.map((badge, index) => (
            <motion.div
              key={badge._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ rotate: index % 2 === 0 ? 5 : -5, scale: 1.1 }}
              className="relative group"
            >
              <BadgeItem badge={badge} />
              {badge.awardedAt && (
                <div className="absolute -top-1 -right-1 size-3.5 md:size-5 bg-sage-soft rounded-full flex items-center justify-center text-white border border-white shadow-sm scale-100 md:scale-0 md:group-hover:scale-100 transition-transform">
                  <Star className="size-2 md:size-[10px]" fill="currentColor" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
