import { useState, useEffect } from 'react'
import { Trophy, Star, Target, Heart } from 'lucide-react'
import { userService } from '../services/user.service'
import type { Badge, Stats } from '../types/index'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { StatCard } from '../components/ui/StatCard'
import { BadgeItem } from '../components/ui/BadgeItem'

export default function Progress() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const safeStats = {
    level: stats?.gamification?.level ?? 1,
    xp: stats?.gamification?.xp ? (stats.gamification.xp % 100) : 0,
    streak: stats?.gamification?.streak ?? 0,
    hearts: 5
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [badgesData, statsData] = await Promise.all([
          userService.getBadges(),
          userService.getStats()
        ])
        setBadges(badgesData)
        setStats(statsData)
      } catch (error) {
        console.error('Erreur progression:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="max-w-6xl mx-auto py-4 md:py-8 space-y-8 md:space-y-12">
      {/* Statistiques Globales */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-hello-black mb-4 md:mb-8 flex items-center gap-3">
          Tableau de Bord <Star className="text-soft-gold fill-current" />
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatCard 
            icon={<Heart className="text-pink-candy" size={20} />}
            label="Cœurs"
            value={safeStats.hearts}
            className="border-pink-milk/30"
          />
          <StatCard 
            icon={<Trophy className="text-pink-candy" size={20} />}
            label="Niveau"
            value={safeStats.level}
            className="border-pink-milk/30"
          />
          <StatCard 
            icon={<Target className="text-pink-candy" size={20} />}
            label="XP"
            value={`${safeStats.xp}%`}
            className="border-pink-milk/30"
          />
          <StatCard 
            icon={<Star className="text-soft-gold" size={20} />}
            label="Série"
            value={`${safeStats.streak} j`}
            className="border-pink-milk/30"
          />
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
