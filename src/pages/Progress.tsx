import { useState, useEffect } from 'react'
import { Trophy, Star, Target, Heart, History, TrendingUp, Calendar, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { userService } from '../services/user.service'
import { progressService } from '../services/progress.service'
import { statsService } from '../services/stats.service'
import { subjectService } from '../services/subject.service'
import type { Badge, ProgressSession, ProgressSummary, GlobalStats, Subject } from '../types/index'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { StatCard } from '../components/ui/StatCard'
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
    <div className="max-w-6xl mx-auto py-4 md:py-8 space-y-8 md:space-y-12 px-4">
      {/* Résumé de Progression */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-hello-black mb-6 flex items-center gap-3">
          Mon Ascension <TrendingUp className="text-pink-candy" />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="kawaii-card bg-white md:col-span-2 flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-20 h-20 bg-pink-candy rounded-full flex items-center justify-center border-4 border-white shadow-kawaii">
                <span className="text-3xl font-bold text-white">{summary?.level || 1}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-sm border border-pink-milk">
                <Trophy size={20} className="text-pink-candy" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-2">
                <span className="font-bold text-hello-black">{summary?.rank || 'Apprentie'} 🎀</span>
                <span className="text-sm font-bold text-pink-candy">{summary?.totalXP || 0} XP au total</span>
              </div>
              <div className="h-4 bg-pink-milk/30 rounded-full overflow-hidden border border-pink-milk/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((summary?.totalXP || 0) % 100)}%` }}
                  className="h-full bg-pink-candy rounded-full"
                />
              </div>
              <p className="text-xs text-hello-black/40 mt-2 font-medium italic">
                Encore {summary?.xpToNextLevel || 0} XP pour le niveau suivant ! ✨
              </p>
            </div>
          </div>

          <div className="kawaii-card bg-hello-black text-white flex flex-col justify-center items-center text-center">
            <Star className="text-soft-gold mb-2" size={32} fill="currentColor" />
            <p className="text-sm opacity-80 uppercase font-bold tracking-wider">Série Actuelle</p>
            <p className="text-4xl font-bold">{globalStats?.streakDays || 0} Jours</p>
          </div>
        </div>
      </section>

      {/* Statistiques Globales */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            icon={<Clock className="text-pink-candy" size={20} />}
            label="Temps Total"
            value={`${globalStats?.totalStudyTime || 0} min`}
            className="border-pink-milk/30"
          />
          <StatCard 
            icon={<Target className="text-pink-candy" size={20} />}
            label="Moyenne/Session"
            value={`${globalStats?.averageSessionDuration || 0} min`}
            className="border-pink-milk/30"
          />
          <StatCard 
            icon={<Star className="text-soft-gold" size={20} />}
            label="Matière Favorite"
            value={globalStats?.mostStudiedSubject || 'N/A'}
            className="border-pink-milk/30"
          />
          <StatCard 
            icon={<Heart className="text-pink-candy" size={20} />}
            label="Succès"
            value={badges.filter(b => b.awardedAt).length}
            className="border-pink-milk/30"
          />
        </div>
      </section>

      {/* Historique Récent */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-hello-black mb-6 flex items-center gap-3">
          Historique d'Étude <History className="text-pink-candy" />
        </h2>
        <div className="kawaii-card bg-white overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-pink-milk/20 border-b border-pink-milk/10">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-hello-black/40 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-hello-black/40 uppercase">Matière</th>
                  <th className="px-6 py-4 text-xs font-bold text-hello-black/40 uppercase">Durée</th>
                  <th className="px-6 py-4 text-xs font-bold text-hello-black/40 uppercase text-right">XP Gagné</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-milk/10">
                {history.length > 0 ? history.slice(0, 5).map((session, i) => (
                  <tr key={i} className="hover:bg-pink-milk/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-hello-black flex items-center gap-2">
                      <Calendar size={14} className="text-pink-candy" />
                      {new Date(session.date || '').toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 font-bold text-hello-black">{getSubjectName(session.subjectId)}</td>
                    <td className="px-6 py-4 text-hello-black/60">{session.durationMinutes} min</td>
                    <td className="px-6 py-4 text-right font-bold text-pink-candy">+{session.xpGained || 0} ✨</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-hello-black/40 italic">
                      Aucune session enregistrée pour le moment. À tes livres ! 📚
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section Badges */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-hello-black flex items-center gap-3">
            Mes Badges Adorables <Trophy className="text-pink-candy" />
          </h2>
          <span className="bg-pink-milk text-pink-candy font-bold px-4 py-1 rounded-full text-xs md:text-sm">
            {badges.filter(b => b.awardedAt).length} / {badges.length} Débloqués
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {badges.map((badge) => (
            <BadgeItem key={badge._id} badge={badge} />
          ))}
        </div>
      </section>
    </div>
  )
}
