import { useState, useEffect } from 'react'
import { Trophy, Star, Target, Heart, History, TrendingUp, Calendar, Clock } from 'lucide-react'
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
    <div className="max-w-7xl mx-auto py-8 md:py-12 space-y-16 px-4 md:px-8">
      {/* Résumé de Progression - Style Page de Garde */}
      <section className="relative">
        <div className="hidden md:flex absolute left-[-2rem] top-10 bottom-10 flex-col justify-around z-20">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-100 border border-gray-400/30 shadow-sm shadow-inner" />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="notebook-page p-8 md:p-12"
        >
          <div className="pl-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-pink-candy/10 rounded-full flex items-center justify-center border border-pink-candy/20">
                <TrendingUp size={24} className="text-pink-candy" />
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold text-hello-black font-display">
                Journal d' <span className="text-pink-candy">Ascension</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
              <div className="md:col-span-2 space-y-8">
                <div className="flex items-center gap-8">
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-pink-milk shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <span className="text-4xl font-bold text-pink-candy font-display">{summary?.level || 1}</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-pink-candy p-2.5 rounded-full shadow-lg border-2 border-white text-white rotate-12">
                      <Trophy size={20} />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-end mb-4">
                      <div className="space-y-1">
                        <span className="text-2xl font-semibold text-hello-black block font-display">{summary?.rank || 'Apprentie'} 🎀</span>
                        <span className="text-xs font-black text-pink-deep/40 uppercase tracking-widest block">Statut Actuel</span>
                      </div>
                      <span className="text-sm font-black text-pink-candy bg-pink-candy/5 px-4 py-1.5 rounded-full border border-pink-candy/10">
                        {summary?.totalXP || 0} XP au total
                      </span>
                    </div>
                    <div className="h-2 bg-pink-milk/20 rounded-full overflow-hidden border border-pink-milk/10 relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((summary?.totalXP || 0) % 100)}%` }}
                        className="h-full bg-pink-candy rounded-full"
                      />
                    </div>
                    <p className="text-xs text-hello-black/40 mt-3 font-serif italic">
                      Encore {summary?.xpToNextLevel || 0} XP pour le prochain chapitre... ✨
                    </p>
                  </div>
                </div>
              </div>

              <motion.div 
                whileHover={{ rotate: -2, scale: 1.02 }}
                className="bg-hello-black text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                <Star className="text-soft-gold mb-4 relative z-10" size={32} fill="currentColor" />
                <p className="text-[10px] opacity-50 uppercase font-black tracking-[0.2em] relative z-10">Série de Concentration</p>
                <p className="text-5xl font-bold font-display relative z-10 mt-1">{globalStats?.streakDays || 0} Jours</p>
                <div className="mt-4 h-[1px] w-12 bg-soft-gold/30 relative z-10" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Statistiques Globales - Style Notes Adhésives */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { icon: <Clock size={20} />, label: "Temps Total", value: `${globalStats?.totalStudyTime || 0} min`, color: "border-pink-candy" },
          { icon: <Target size={20} />, label: "Moyenne/Session", value: `${globalStats?.averageSessionDuration || 0} min`, color: "border-sage-soft" },
          { icon: <Star size={20} />, label: "Matière Favorite", value: globalStats?.mostStudiedSubject || 'N/A', color: "border-pink-candy" },
          { icon: <Heart size={20} />, label: "Succès", value: badges.filter(b => b.awardedAt).length, color: "border-sage-soft" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ rotate: i % 2 === 0 ? 2 : -2, y: -5 }}
            className={`bg-white p-8 rounded-sm shadow-notebook border-l-4 ${stat.color} relative group overflow-hidden`}
          >
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
              {stat.icon}
            </div>
            <div className="text-pink-deep/40 mb-4 group-hover:scale-110 transition-transform inline-block">
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-pink-deep/30 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-2xl font-semibold text-hello-black font-display truncate">{stat.value}</p>
          </motion.div>
        ))}
      </section>

      {/* Historique Récent - Style Carnet de Bord */}
      <section className="relative">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-hello-black font-display">
            Journal de <span className="text-pink-candy">Bord</span>
          </h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-pink-candy/20 to-transparent" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="notebook-page overflow-hidden p-0"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-pink-milk/10">
                  <th className="px-8 py-6 text-[10px] font-black text-pink-deep/40 uppercase tracking-[0.2em]">Date</th>
                  <th className="px-8 py-6 text-[10px] font-black text-pink-deep/40 uppercase tracking-[0.2em]">Matière</th>
                  <th className="px-8 py-6 text-[10px] font-black text-pink-deep/40 uppercase tracking-[0.2em]">Durée</th>
                  <th className="px-8 py-6 text-[10px] font-black text-pink-deep/40 uppercase tracking-[0.2em] text-right">XP Gagné</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-milk/5">
                {history.length > 0 ? history.slice(0, 5).map((session, i) => (
                  <tr key={i} className="hover:bg-pink-milk/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <Calendar size={14} className="text-pink-candy/40" />
                        <span className="font-medium text-hello-black/70 font-serif">
                          {new Date(session.date || '').toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-semibold text-hello-black font-display">{getSubjectName(session.subjectId)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-hello-black/50 text-sm">
                        <Clock size={12} />
                        {session.durationMinutes} min
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="font-bold text-pink-candy bg-pink-candy/5 px-3 py-1 rounded-full text-sm">
                        +{session.xpGained || 0} ✨
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="max-w-xs mx-auto space-y-4">
                        <div className="w-16 h-16 bg-pink-milk/20 rounded-full flex items-center justify-center mx-auto">
                          <History className="text-pink-candy/30" size={32} />
                        </div>
                        <p className="text-hello-black/40 italic font-serif">
                          Aucun chapitre n'a encore été écrit. À tes livres ! 📚
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      {/* Section Badges - Style Planche de Stickers */}
      <section className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-hello-black font-display">
              Collection de <span className="text-pink-candy">Stickers</span>
            </h2>
            <p className="text-pink-deep/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
              Souvenirs de tes plus belles victoires
            </p>
          </div>
          <div className="bg-white px-6 py-2 rounded-full border border-pink-milk shadow-sm">
            <span className="text-pink-candy font-bold text-sm">
              {badges.filter(b => b.awardedAt).length} <span className="text-pink-deep/30 mx-1">/</span> {badges.length} Débloqués
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
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
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-sage-soft rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm scale-0 group-hover:scale-100 transition-transform">
                  <Star size={10} fill="currentColor" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
