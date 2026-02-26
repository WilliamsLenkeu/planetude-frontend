import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { planningService } from '../services/planning.service'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { PageHeader } from '../components/PageHeader'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Plus, Calendar } from 'lucide-react'

export default function Planning() {
  const navigate = useNavigate()
  const { data: plannings, isLoading } = useQuery({
    queryKey: ['plannings'],
    queryFn: () => planningService.getAll(),
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Plannings"
        description="Gérez vos plannings d'étude"
        action={
          <Button>
            <Plus size={18} />
            Nouveau planning
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner fullScreen={false} />
        </div>
      ) : plannings && plannings.length > 0 ? (
        <div className="grid gap-4">
          {plannings.map((planning) => (
            <Card
              key={planning._id}
              hover
              onClick={() => navigate(`/planning/${planning._id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                    {planning.titre}
                  </h3>
                  <p className="text-sm flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
                    <Calendar size={14} />
                    {new Date(planning.dateDebut).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Badge variant="primary">{planning.sessions?.length || 0} sessions</Badge>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Aucun planning pour le moment
            </p>
            <Button>
              <Plus size={18} />
              Créer mon premier planning
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
