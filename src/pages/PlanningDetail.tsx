import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { planningService } from '../services/planning.service'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ArrowLeft, Clock, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PlanningDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: planning, isLoading } = useQuery({
    queryKey: ['planning', id],
    queryFn: () => planningService.getById(id!),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: () => planningService.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plannings'] })
      toast.success('Planning supprimé')
      navigate('/planning')
    },
    onError: (err: any) => toast.error(err?.message || 'Erreur lors de la suppression'),
  })

  const handleDelete = () => {
    if (planning && window.confirm(`Supprimer le planning "${planning.titre}" ?`)) {
      deleteMutation.mutate()
    }
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  if (!planning) {
    return (
      <div className="text-center py-12">
        <p className="mb-4" style={{ color: 'var(--color-text-muted)' }}>
          Planning non trouvé
        </p>
        <Button onClick={() => navigate('/planning')}>Retour aux plannings</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/planning')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft size={18} />
            Retour
          </Button>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            {planning.titre}
          </h1>
          <p className="text-sm flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
            <Clock size={14} />
            {new Date(planning.dateDebut).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="primary">{planning.sessions?.length || 0} sessions</Badge>
          <Button
            variant="ghost"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            style={{ color: '#DC2626' }}
            className="hover:!bg-red-50"
          >
            <Trash2 size={18} />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {planning.sessions?.map((session, index) => (
          <Card key={session._id || index}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                  {session.matiere}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <span>
                    {new Date(session.debut).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {' – '}
                    {new Date(session.fin).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {session.type && <span>• {session.type}</span>}
                  {session.priority && <Badge variant="warning">{session.priority}</Badge>}
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
