import { useQuery } from '@tanstack/react-query'
import { planningService } from '../services/planning.service'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

export default function Planning() {
  const { data: plannings, isLoading } = useQuery({
    queryKey: ['plannings'],
    queryFn: () => planningService.getAll()
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            Plannings
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Gérez vos plannings d'étude
          </p>
        </div>
        <Button>Nouveau planning</Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-[var(--color-text-secondary)]">Chargement...</p>
        </div>
      ) : plannings && plannings.length > 0 ? (
        <div className="grid gap-4">
          {plannings.map((planning) => (
            <Card key={planning._id} hover className="cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                    {planning.titre}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {new Date(planning.dateDebut).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Badge variant="primary">
                  {planning.sessions?.length || 0} sessions
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-[var(--color-text-secondary)] mb-4">
              Aucun planning pour le moment
            </p>
            <Button>Créer mon premier planning</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
