import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { planningService } from '../services/planning.service'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

export default function PlanningDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: planning, isLoading } = useQuery({
    queryKey: ['planning', id],
    queryFn: () => planningService.getById(id!),
    enabled: !!id
  })

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  if (!planning) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-text-secondary)] mb-4">
          Planning non trouvé
        </p>
        <Button onClick={() => navigate('/planning')}>
          Retour aux plannings
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate('/planning')} className="mb-4">
            ← Retour
          </Button>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            {planning.titre}
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            {new Date(planning.dateDebut).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <Badge variant="primary">
          {planning.sessions?.length || 0} sessions
        </Badge>
      </div>

      <div className="space-y-4">
        {planning.sessions?.map((session, index) => (
          <Card key={session._id || index}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                  {session.matiere}
                </h3>
                <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                  <span>
                    {new Date(session.debut).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {' - '}
                    {new Date(session.fin).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {session.type && <span>• {session.type}</span>}
                  {session.priority && (
                    <Badge variant="warning">{session.priority}</Badge>
                  )}
                </div>
              </div>
              <Badge
                variant={
                  session.statut === 'termine'
                    ? 'success'
                    : session.statut === 'en_cours'
                    ? 'primary'
                    : 'error'
                }
              >
                {session.statut}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
