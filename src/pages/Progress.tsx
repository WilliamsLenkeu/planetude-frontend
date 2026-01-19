import { useQuery } from '@tanstack/react-query'
import { statsService } from '../services/stats.service'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

export default function Progress() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => statsService.getGlobalStats()
  })

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          Statistiques
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Suivez votre progression
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-[var(--color-text-secondary)] mb-2">
            Niveau
          </div>
          <div className="text-3xl font-bold text-[var(--color-text-primary)]">
            {stats?.level || 1}
          </div>
        </Card>

        <Card>
          <div className="text-sm text-[var(--color-text-secondary)] mb-2">
            XP Total
          </div>
          <div className="text-3xl font-bold text-[var(--color-text-primary)]">
            {stats?.xp || 0}
          </div>
        </Card>

        <Card>
          <div className="text-sm text-[var(--color-text-secondary)] mb-2">
            Streak
          </div>
          <div className="text-3xl font-bold text-[var(--color-text-primary)]">
            {stats?.streakDays || 0} jours
          </div>
        </Card>

        <Card>
          <div className="text-sm text-[var(--color-text-secondary)] mb-2">
            Temps total
          </div>
          <div className="text-3xl font-bold text-[var(--color-text-primary)]">
            {Math.round((stats?.totalStudyTime || 0) / 60)}h
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold text-[var(--color-text-primary)] mb-4">
          Maîtrise par matière
        </h2>
        {stats?.masteryRadar && stats.masteryRadar.length > 0 ? (
          <div className="space-y-3">
            {stats.masteryRadar.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-primary)]">
                  {item.subject}
                </span>
                <Badge variant="primary">{Math.round(item.score)}%</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-[var(--color-text-secondary)] text-sm">
            Pas encore de données de progression
          </p>
        )}
      </Card>
    </div>
  )
}
