import { useQuery } from '@tanstack/react-query'
import { statsService } from '../services/stats.service'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { PageHeader } from '../components/PageHeader'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

export default function Progress() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => statsService.getGlobalStats(),
  })

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Statistiques"
        description="Suivez votre progression"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Niveau
          </div>
          <div className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
            {stats?.level || 1}
          </div>
        </Card>
        <Card>
          <div className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
            XP Total
          </div>
          <div className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
            {stats?.xp || 0}
          </div>
        </Card>
        <Card>
          <div className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Streak
          </div>
          <div className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
            {stats?.streakDays || 0} jours
          </div>
        </Card>
        <Card>
          <div className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Temps total
          </div>
          <div className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
            {Math.round((stats?.totalStudyTime || 0) / 60)}h
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
          Maîtrise par matière
        </h2>
        {stats?.masteryRadar && stats.masteryRadar.length > 0 ? (
          <div className="space-y-3">
            {stats.masteryRadar.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                  {item.subject}
                </span>
                <Badge variant="primary">{Math.round(item.score)}%</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Pas encore de données de progression
          </p>
        )}
      </Card>
    </div>
  )
}
